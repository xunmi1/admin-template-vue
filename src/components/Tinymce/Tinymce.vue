<template>
    <div>
        <input ref="fileNode" :accept="fileAccept.join()" style="display: none" type="file">
        <div :style="{ display: !visible ? 'none' : 'block' }">
            <div v-if="active" :id="editorId" :key="editorId">
                <slot />
            </div>
        </div>
        <div :style="{ display: visible ? 'none' : 'block' }" v-html="value"></div>
    </div>
</template>

<script>
    import { classicConfig, inlineConfig } from './tinymce.config';
    import props from './props';
    // Import TinyMCE
    import tinymce from 'tinymce/tinymce';
    import 'tinymce/themes/silver';
    import 'tinymce/themes/mobile';
    import 'tinymce/plugins/advlist';
    import 'tinymce/plugins/autosave';
    import 'tinymce/plugins/link';
    import 'tinymce/plugins/image';
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

    export default {
        model: { prop: 'value', event: 'change' },
        props,
        data () {
            return {
                editorId: this.editorKey || `editor${Date.now()}${Math.round(Math.random() * 1000)}`,
                active: true,
            };
        },
        watch: {
            skin () {
                this.updateEditor();
            },
            mode () {
                this.updateEditor();
            },
            contentMode () {
                this.updateEditor();
            },
            isMobile () {
                this.updateEditor();
            },
        },
        created () {
            [tinymce.baseURL, tinymce.suffix] = [this.baseURL, '.min'];
            this.options = this.getOptions();
            this.updateSkin();
            this.updateMode();
        },
        mounted () {
            this.createEditor();
        },
        // `vue` 对 `iframe` 不支持，创建后对 dom 不会触发修改
        // 再次进入或离开时，需重新创建和销毁
        activated () {
            this.createEditor();
        },
        deactivated () {
            this.destroyEditor();
        },
        beforeDestroy () {
            this.destroyEditor();
        },
        methods: {
            getOptions () {
                const setup = editor => {
                    editor.once('init', () => {
                        this.$emit('init', editor);
                        this.editor = editor;
                        this.bindWatch();
                    });
                };
                return {
                    selector: `div#${this.editorId}`,
                    autosave_prefix: this.autoSavePrefix,
                    setup,
                    init_instance_callback: this.bindEvent,
                    //文件上传（浏览本地文件，设置此属性会开启本地文件浏览功能）
                    file_picker_callback: this.handleFile,
                    // 图片上传（包括直接拖拽，插入图片中的上传选项）
                    images_upload_handler: this.imageUpload,
                };
            },
            updateSkin () {
                this.options.skin = this.skin === 'light' ? 'oxide' : 'oxide-dark';
                this.options.content_css = (this.config || {}).content_css || this.contentMode;
            },
            updateMode () {
                const inline = this.mode === 'inline';
                Object.assign(this.options, inline ? inlineConfig : classicConfig, this.config || {});
            },
            createEditor () {
                this.active = true;
                this.$nextTick(() => tinymce.init(this.options));
            },
            destroyEditor () {
                if (this.editor) {
                    this.unwatchValue();
                    this.editor.off();
                    this.editor.remove();
                    this.active = false;
                    this.editor = null;
                }
            },
            updateEditor () {
                this.destroyEditor();
                this.updateSkin();
                this.updateMode();
                this.createEditor();
            },
            handleFile (callback, value, meta) {
                const fileNode = this.$refs.fileNode;
                fileNode.onchange = () => {
                    const file = fileNode.files[0];
                    if (meta.filetype === 'image') {
                        this.handleImage(file, callback);
                    }
                    if (meta.filetype === 'file') {
                        this.fileUpload(file, callback);
                    }
                };
                fileNode.click();
            },
            // 插入图片（普通方式），将 file 处理成 blobInfo，确认后，交给 imageUpload 处理
            handleImage (file, callback) {
                const reader = new FileReader();
                reader.onload = () => {
                    const id = 'blobid' + Date.now();
                    const blobCache = this.editor.editorUpload.blobCache;
                    const base64 = reader.result.split(',')[1];
                    const blobInfo = blobCache.create(id, file, base64);
                    blobCache.add(blobInfo);
                    this.imageUpload(blobInfo, callback);
                    // callback(blobInfo.blobUri(), { title: file.name, alt: file.name });
                };
                reader.readAsDataURL(file);
            },

            fileUpload (file, callback) {
                const valid = this.validateFile(file);
                if (!valid.result) {
                    this.$emit('validator-error', { type: 'file', message: valid.message });
                    this.failAlert(valid.message);
                    return;
                }
                this.http({ name: 'file', file })
                    .then(res => {
                        callback(res.path, { title: file.name, text: file.name });
                        this.$emit('success', res);
                    })
                    .catch(err => {
                        this.$emit('error', { type: 'upload', message: err });
                    });
            },
            imageUpload (blobInfo, success, failure) {
                const blob = blobInfo.blob();
                // 如果不上传服务器，图片会以 Base64 形式上传
                if (typeof this.http !== 'function') return;
                const valid = this.validateImage(blob);
                // 验证失败
                if (!valid.result) {
                    this.$emit('validator-error', { type: 'image', message: valid.message });
                    this.failAlert(valid.message);
                    return;
                }
                this.http({ name: 'image', file: blob })
                    .then(res => {
                        success(res.path, { title: blob.name, alt: blob.name });
                        this.$emit('success', res.path);
                    })
                    .catch(err => {
                        this.$emit('error', { type: 'uplaod', message: err });
                        if (typeof failure === 'function') failure('上传失败！');
                    });
            },

            validateFile (blob) {
                const rules = [
                    {
                        validator: () => typeof this.http === 'function',
                        message: '不支持上传文件',
                    },
                    {
                        validator: () => this.fileAccept.some(type => blob.name.toLowerCase().search(type) !== -1),
                        message: '格式不符合要求',
                    },
                ];
                // 附加自定义验证规则
                rules.push(...(this.fileRules || []));
                const failRule = rules.find(rule => !rule.validator(blob));
                return { result: !failRule, message: failRule && failRule.message };
            },
            validateImage (blob) {
                const rules = [
                    {
                        validator: () => blob.size <= this.maxSize,
                        message: '图片大小超出上限',
                    },
                    {
                        validator: () => this.imageAccept.some(type => blob.type.search(type) !== -1),
                        message: '格式不符合要求',
                    },
                ];
                // 附加自定义验证规则
                rules.push(...(this.imageRules || []));
                const failRule = rules.find(rule => !rule.validator(blob));
                return { result: !failRule, message: failRule && failRule.message };
            },
            bindEvent (editor) {
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
            bindWatch () {
                const valueWatch = function (newVal) {
                    if (newVal !== this.editor.getContent()) this.editor.setContent(newVal || '');
                };
                this.unwatchValue = this.$watch('value', valueWatch, { immediate: true });
            },
            failAlert (message) {
                // 如果父组件未指定 validator-error 响应事件，则默认使用富文本的消息提醒
                if (!this.$listeners['validator-error']) {
                    tinymce.activeEditor.windowManager.alert(message);
                }
            },
        },
    };
</script>
