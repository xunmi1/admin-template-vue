<template>
  <div>
    <input ref="uploadNode" style="display: none" type="file" />
    <div v-show="visible">
      <div v-if="active" ref="editorRef">
        <slot />
      </div>
    </div>
    <div v-if="!visible" v-html="value"></div>
  </div>
</template>

<script>
import { classicConfig, inlineConfig } from './tinymce.config';
import props from './props';
import { search, distinguishMedia } from './utils';
// Import TinyMCE
import tinymce from 'tinymce/tinymce';
import 'tinymce/themes/silver';
import 'tinymce/plugins/advlist';
import 'tinymce/plugins/autosave';
import 'tinymce/plugins/link';
import 'tinymce/plugins/image';
import 'tinymce/plugins/media';
import 'tinymce/plugins/imagetools';
import 'tinymce/plugins/code';
import 'tinymce/plugins/nonbreaking';
import 'tinymce/plugins/pagebreak';
import 'tinymce/plugins/table';
import 'tinymce/plugins/paste';
import 'tinymce/plugins/autolink';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/charmap';
import 'tinymce/plugins/print';
import 'tinymce/plugins/preview';
import 'tinymce/plugins/anchor';
import 'tinymce/plugins/searchreplace';
import 'tinymce/plugins/insertdatetime';
import 'tinymce/plugins/wordcount';
import 'tinymce/plugins/fullscreen';
import 'tinymce/plugins/quickbars';
import 'tinymce/plugins/help';
// Note: TinyMCE version > 5.3.0
import 'tinymce/icons/default';

export default {
  name: 'Tinymce',
  model: { prop: 'value', event: 'change' },
  props,
  data() {
    return {
      active: true,
    };
  },
  watch: {
    skin() {
      this.updateEditor();
    },
    mode() {
      this.updateEditor();
    },
    contentMode() {
      this.updateEditor();
    },
  },
  created() {
    this.options = this.getOptions();
    this.updateSkin();
    this.updateMode();
  },
  mounted() {
    this.createEditor();
  },
  // `vue` 对 `iframe` 不支持，创建后对 dom 不会触发修改
  // 再次进入或离开时，需重新创建和销毁
  activated() {
    this.createEditor();
  },
  deactivated() {
    this.destroyEditor();
  },
  beforeDestroy() {
    this.destroyEditor();
  },
  methods: {
    getOptions() {
      const setup = editor => {
        editor.once('init', () => {
          this.$emit('init', editor);
          this.editor = editor;
          this.bindWatch();
        });
      };
      return {
        setup,
        base_url: this.baseURL,
        document_base_url: this.documentURL,
        autosave_prefix: this.autoSavePrefix,
        init_instance_callback: this.bindEvent,
        //文件上传（浏览本地文件，设置此属性会开启本地文件浏览功能）
        file_picker_callback: this.openExplorer,
        // 图片上传（包括直接拖拽，插入图片中的上传选项）
        images_upload_handler: this.imageUpload,
      };
    },
    updateSkin() {
      this.options.skin = this.skin === 'light' ? 'oxide' : 'oxide-dark';
      this.options.content_css = (this.config || {}).content_css || this.contentMode;
    },
    updateMode() {
      const inline = this.mode === 'inline';
      Object.assign(this.options, inline ? inlineConfig : classicConfig, this.config || {});
    },
    createEditor() {
      this.active = true;
      this.$nextTick(() => {
        const target = this.$refs.editorRef;
        tinymce.init({ target, ...this.options });
      });
    },
    destroyEditor() {
      if (!this.editor) return;
      this.unwatchValue();
      this.editor.windowManager.close();
      this.editor.off();
      this.editor.destroy();
      this.active = false;
      this.editor = null;
    },
    updateEditor() {
      this.destroyEditor();
      this.updateSkin();
      this.updateMode();
      this.createEditor();
    },
    openExplorer(callback, value, meta) {
      const uploadNode = this.$refs.uploadNode;
      uploadNode.setAttribute('accept', this.accept[meta.filetype]);
      uploadNode.onchange = e => {
        // need to prevent the `change` event, otherwise the parent's listener will be triggered
        e.stopPropagation();
        const file = e.target.files[0];
        this.handleFile(meta.filetype)(callback, file, meta);
      };
      uploadNode.click();
    },
    handleFile(type) {
      const handlerMap = {
        image: this.handleImage,
        file: this.fileUpload,
        media: this.fileUpload,
      };
      return handlerMap[type];
    },
    // 插入图片（普通方式），将 file 处理成 blobInfo，确认后，交给 imageUpload 处理
    handleImage(callback, file) {
      const reader = new FileReader();
      reader.onload = () => {
        const id = 'blobid' + Date.now();
        const blobCache = this.editor.editorUpload.blobCache;
        const base64 = reader.result.split(',')[1];
        const blobInfo = blobCache.create(id, file, base64);
        blobCache.add(blobInfo);
        this.imageUpload(blobInfo, callback);
      };
      reader.readAsDataURL(file);
    },

    fileUpload(callback, file, meta) {
      const valid = this.validateFile(file, meta);
      if (!valid.result) {
        this.$emit('validator-error', { type: meta.filetype, message: valid.message });
        this.failAlert(valid.message);
        return;
      }
      this.uploadHandler({ filetype: distinguishMedia(file.type), file }, callback);
    },
    imageUpload(blobInfo, success, failure) {
      const file = blobInfo.blob();
      const valid = this.validateImage(file);
      // 验证失败
      if (!valid.result) {
        this.$emit('validator-error', { type: 'image', message: valid.message });
        this.failAlert(valid.message);
        return;
      }
      // 如果不上传服务器，图片会以 Base64 形式上传
      if (typeof this.http !== 'function') {
        return success(blobInfo.blobUri(), { title: file.name, alt: file.name });
      }
      this.uploadHandler({ filetype: 'image', file }, success, failure);
    },
    uploadHandler({ filetype, file }, success, failure) {
      const stopProgress = this.setProgress();
      this.http({ filetype, file })
        .then(res => {
          success(res.path, { title: file.name, alt: file.name });
          this.$emit('success', res.path);
        })
        .catch(err => {
          this.$emit('error', { type: 'upload', message: err });
          if (typeof failure === 'function') failure('上传失败');
        })
        .finally(stopProgress);
    },
    validateFile(file, meta) {
      const rules = [
        {
          validator: () => typeof this.http === 'function',
          message: '不支持上传文件',
        },
        {
          validator: () => this.accept[meta.filetype].some(type => search(file.type, type) || search(file.name, type)),
          message: '格式不符合要求',
        },
      ];
      // 附加自定义验证规则
      rules.push(...(this.fileRules || []));
      const failRule = rules.find(rule => !rule.validator(file, meta));
      return { result: !failRule, message: failRule && failRule.message };
    },
    validateImage(file) {
      const rules = [
        {
          validator: file => file.size <= this.maxSize,
          message: '图片大小超出上限',
        },
        {
          validator: file => this.accept.image.some(type => search(file.type, type) || search(file.name, type)),
          message: '格式不符合要求',
        },
      ];
      // 附加自定义验证规则
      rules.push(...(this.imageRules || []));
      const failRule = rules.find(rule => !rule.validator(file));
      return { result: !failRule, message: failRule && failRule.message };
    },
    bindEvent(editor) {
      const events = [
        {
          key: 'Input SetContent Change',
          handler: () => this.$emit('change', editor.getContent()),
        },
        {
          key: 'Focus',
          handler: () => this.$emit('focus', editor.getContent()),
        },
        {
          key: 'Blur',
          handler: () => this.$emit('blur', editor.getContent()),
        },
      ];
      events.forEach(event => editor.on(event.key, event.handler));
    },
    bindWatch() {
      const valueWatch = function (newVal) {
        if (newVal !== this.editor.getContent()) this.editor.setContent(newVal || '');
      };
      this.unwatchValue = this.$watch('value', valueWatch, { immediate: true });
    },
    failAlert(message) {
      // 如果父组件未指定 validator-error 响应事件，则默认使用富文本的消息提醒
      if (!this.$listeners['validator-error']) {
        this.editor.windowManager.alert(message);
      }
    },
    setProgress() {
      this.editor.setProgressState(true);
      return () => this.editor.setProgressState(false);
    },
  },
};
</script>
