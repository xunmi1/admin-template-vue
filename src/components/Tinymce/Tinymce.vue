<template>
    <div>
        <input :accept="fileAccept.join()" ref="fileNode" style="display: none" type="file">
        <div :style="{display: !visible ? 'none' : 'block'}">
            <div :id="editorId" v-if="active">
                <slot />
            </div>
        </div>
        <div v-html="value" :style="{display: visible ? 'none' : 'block'}"></div>
    </div>
</template>

<script>
    import defaultConfig from './tinymce.config';
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
        props: {
            value: [String, Number],
            // 是否可见
            visible: {
                type: Boolean,
                default: true
            },
            // 模式 'default' | 'inline'
            mode: {
                type: String,
                validator: value => ['inline', 'default'].includes(value),
                default: 'default'
            },
            // 是否为手机端（在 mode = 'default'下，tinyMCE 会自动判断，这里是功能上调整）
            isMobile: {
                type: Boolean,
                default: false
            },
            // 显示类型 ，可选 'word' | 'default'，'word': 模拟 word 显示方式（手机端无效）
            type: {
                type: String,
                validator: value => ['word', 'default'].includes(value),
                default: 'default'
            },
            // 皮肤，可选 'light' | 'dark'
            skin: {
                type: String,
                validator: value => ['light', 'dark'].includes(value),
                default: 'light'
            },
            // 富文本配置项，会覆盖和并默认配置
            config: Object,
            // 上传 http 方法
            http: Function,
            // 图片接受类型
            imageAccept: {
                type: Array,
                default: () => ['image/*']
            },
            // 文件接受类型
            fileAccept: {
                type: Array,
                default: () => ['.txt', '.docx', '.doc', '.xlsx', '.xls', '.csv', '.pptx', '.ppt', '.pdf', '.zip', '.rar', '.md']
            },
            // 图片大小上限
            maxSize: { // 图片大小
                type: Number,
                default: 52428800
            },
            // 图片验证规则
            imageRules: {
                type: Array,
                validator: rules => Array.isArray(rules) && rules.every(rule => typeof rule.validator === 'function')
            },
            // 文件验证规则
            fileRules: {
                type: Array,
                validator: rules => Array.isArray(rules) && rules.every(rule => typeof rule.validator === 'function')
            },
            // 文本自动保存到 localStorage 的键名前缀
            autoSavePrefix: {
                type: String,
                default: 'tinymce-autosave-{path}{query}-{id}-'
            }
        },
        data () {
            return {
                editorId: `editor${ Date.now() }${ Math.round(Math.random() * 1000) }`,
                active: true,
                isCreated: false
            };
        },
        watch: {
            skin () {
                this.updateEditor();
            },
            mode () {
                this.updateEditor();
            },
            isMobile () {
                this.updateEditor();
            }
        },
        created () {
            this.setEditorStyle();
            this.option = this.getOptions();
            this.updateSkin();
            this.updateMode();
            this.updateToolbar();
        },
        mounted () {
            this.createEditor();
            this.isCreated = true;
        },
        // tinyMCE 不支持 vue 的组件缓存，因此再次进入或离开时，需重新创建和销毁
        activated () {
            if (this.isCreated) {
                this.isCreated = false;
            } else {
                this.createEditor();
            }
        },
        deactivated () {
            this.destroyEditor();
        },
        beforeDestroy () {
            this.destroyEditor();
        },
        methods: {
            getOptions () {
                tinymce.baseURL = './tinymce';
                tinymce.suffix = '.min';
                const setting = {
                    selector: `#${ this.editorId }`,
                    autosave_prefix: this.autoSavePrefix,
                    setup: editor => {
                        editor.once('init', () => {
                            this.$emit('init', editor);
                            this.editor = editor;
                            this.bindWatch();
                        });
                    },
                    init_instance_callback: this.bindEvent,
                    //文件上传（浏览本地文件，设置此属性会开启本地文件浏览功能）
                    file_picker_callback: this.handleFile,
                    // 图片上传
                    images_upload_handler: this.imageUpload
                };
                return { ...defaultConfig, ...setting, ...this.config };
            },
            updateSkin () {
                this.option.skin = this.skin === 'light' ? 'oxide' : 'oxide-dark';
            },
            updateMode () {
                const isInline = this.mode === 'inline';
                const plugins = this.option.plugins;
                this.option.content_style = this.editorStyle[isInline ? 'default' : this.type];
                this.option.inline = isInline;
                this.option.toolbar = !isInline && defaultConfig.toolbar;
                this.option.menubar = !isInline && defaultConfig.menubar;
                if (isInline) plugins.push('quickbars');
                else if (plugins[plugins.length - 1] === 'quickbars') plugins.pop();
            },
            updateToolbar () {
                if (this.isMobile) {
                    this.option.menubar = !this.isMobile;
                    this.option.content_style = this.editorStyle.default;
                    this.option.toolbar = defaultConfig.mobile_phone_toolbar;
                } else {
                    this.option.menubar = defaultConfig.menubar;
                    this.option.content_style = this.editorStyle[this.type];
                    this.option.toolbar = defaultConfig.toolbar;
                }
            },
            createEditor () {
                this.active = true;
                this.$nextTick(() => tinymce.init(this.option));
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
                this.updateToolbar();
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
                    callback(blobInfo.blobUri(), { title: file.name });
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
                this.http(file)
                    .then(res => {
                        callback('', { title: file.name });
                        this.$emit('success', res);
                    })
                    .catch(err => {
                        this.$emit('error', { type: 'uplaod', message: err });
                    });
            },
            imageUpload (blobInfo, success, failure) {
                const blob = blobInfo.blob();

                // 如果不上传服务器，图片会以 Base64 形式上传
                if (typeof this.http !== 'function') {
                    return;
                } else {
                    const valid = this.validateImage(blob);
                    if (!valid.result) {
                        this.$emit('validator-error', { type: 'image', message: valid.message });
                        this.failAlert(valid.message);
                        return;
                    }
                }
                this.http({file: blob})
                    .then(res => {
                        success(res.path);
                        this.$emit('success', res.path);
                    })
                    .catch(err => {
                        this.$emit('error', { type: 'uplaod', message: err });
                        failure('上传失败！');
                    });
            },

            validateFile (blob) {
                const rules = [
                    {
                        validator: () => typeof this.http === 'function',
                        message: '不支持上传文件'
                    },
                    {
                        validator: () => this.fileAccept.some(type => blob.name.toLowerCase().search(type) !== -1),
                        message: '格式不符合要求'
                    }
                ];
                // 附加自定义验证规则
                rules.push(...this.fileRules || []);
                const failRule = rules.find(rule => !rule.validator(blob));
                return { result: !failRule, message: failRule && failRule.message };
            },
            validateImage (blob) {
                const rules = [
                    {
                        validator: () => blob.size <= this.maxSize,
                        message: '图片大小超出上限'
                    },
                    {
                        validator: () => this.imageAccept.some(type => blob.type.search(type) !== -1),
                        message: '格式不符合要求'
                    }
                ];
                // 附加自定义验证规则
                rules.push(...this.imageRules || []);
                const failRule = rules.find(rule => !rule.validator(blob));
                return { result: !failRule, message: failRule && failRule.message };
            },
            bindEvent (editor) {
                const events = [
                    {
                        key: 'Input Undo Redo SetContent',
                        handler: () => this.$emit('input', editor.getContent())
                    },
                    {
                        key: 'Focus',
                        handler: () => this.$emit('focus', editor.getContent())
                    },
                    {
                        key: 'Blur',
                        handler: () => this.$emit('blur', editor.getContent())
                    }
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
            setEditorStyle () {
                const defaultStyle = 'p {font-size: 14pt;font-family: FangSong; line-height: 1.5; margin: 0}';
                this.editorStyle = {
                    default: defaultStyle,
                    word: `
                        html { background-color: #eee}
                        body {
                            width: 210mm;
                            min-height: 247mm;
                            padding: 12mm 28mm;
                            margin: 16px auto;
                            box-shadow: 0 1px 4px rgba(10, 21, 42, .12);
                            background-color: #fff;
                        }
                    ` + defaultStyle
                };
            }
        }
    };
</script>
