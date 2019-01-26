<template>
    <div>
        <input :accept="fileAccept.join()" ref="fileNode" style="display: none" type="file">
        <div :id="editorId" v-if="active">
            <slot />
        </div>
    </div>
</template>

<script>
    import defaultConfig from './tinymce.config';
    // Import TinyMCE
    import tinymce from 'tinymce/tinymce';
    import 'tinymce/themes/modern';
    import 'tinymce/plugins/advlist';
    import 'tinymce/plugins/autosave';
    import 'tinymce/plugins/link';
    import 'tinymce/plugins/image';
    import 'tinymce/plugins/imagetools';
    import 'tinymce/plugins/code';
    import 'tinymce/plugins/nonbreaking';
    import 'tinymce/plugins/pagebreak';
    import 'tinymce/plugins/table';
    import 'tinymce/plugins/textcolor';
    import 'tinymce/plugins/paste';
    import 'tinymce/plugins/colorpicker';
    import 'tinymce/plugins/autolink';
    import 'tinymce/plugins/lists';
    import 'tinymce/plugins/charmap';
    import 'tinymce/plugins/print';
    import 'tinymce/plugins/preview';
    import 'tinymce/plugins/anchor';
    import 'tinymce/plugins/searchreplace';
    import 'tinymce/plugins/insertdatetime';
    import 'tinymce/plugins/contextmenu';
    import 'tinymce/plugins/wordcount';
    import 'tinymce/plugins/fullscreen';

    export default {
        props: {
            value: [String, Number],
            config: Object,
            http: Function,
            imageAccept: { // 文件类型
                type: Array,
                default () {
                    return ['image/*'];
                }
            },
            fileAccept: {
                type: Array,
                default () {
                    return ['.txt', '.docx', '.doc', '.xlsx', '.xls', '.csv', '.pptx', '.ppt', '.pdf', 'zip', '.rar', '.md'];
                }
            },
            maxSize: { // 图片大小
                type: Number,
                default: 52428800
            },
            type: {
                type: String,
                validator (value) {
                    return ['standard', 'default'].indexOf(value) !== -1;
                },
                default: 'default'
            },
            // 图片验证规则
            imageRules: {
                type: Array,
                validator (rules) {
                    return Array.isArray(rules) && rules.every(rule => typeof rule.validator === 'function');
                }
            },
            // 文件验证规则
            fileRules: {
                type: Array,
                validator (rules) {
                    return Array.isArray(rules) && rules.every(rule => typeof rule.validator === 'function');
                }
            }
        },
        data () {
            return {
                editorId: `editor${ Date.now() }${ Math.round(Math.random() * 1000)}`,
                active: true
            };
        },
        created () {
            this.setEditorStyle();
            this.option = this.getOptions();
        },
        mounted () {
            this.createEditor(this.option);
            this.hasCreated = true;
        },
        // tinyMCE 不支持 vue 的组件缓存，因此再次进入或离开时，需重新创建或销毁
        activated () {
            if (this.hasCreated) {
                this.hasCreated = false;
            } else {
                this.active = true;
                this.createEditor(this.option);
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
                    content_style: this.editorStyle[this.type],
                    setup: editor => {
                        editor.once('init', () => {
                            this.$emit('init', editor);
                            this.editor = editor;
                            this.bindWatch();
                        });
                    },
                    init_instance_callback: this.bindEvent,
                    file_picker_types: 'file image media',
                    //文件上传
                    file_picker_callback: this.handleFile,
                    // 图片上传
                    images_upload_handler: this.imageUpload
                };
                return { ...defaultConfig, ...setting, ...this.config };
            },
            createEditor (option) {
                this.$nextTick(() => {
                    tinymce.init(option);
                });
            },
            destroyEditor () {
                if (this.editor) {
                    this.unwatchValue();
                    this.editor.off();
                    this.editor.remove();
                    this.active = false;
                }
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
            imageUpload (blobInfo, success, failure) {
                if (!this.validateImage(blobInfo, success, failure)) return;
                const formData = new FormData();
                formData.append('image', blobInfo.blob());
                this.http(formData)
                    .then(res => {
                        // success();
                        this.$emit('success', res);
                    })
                    .catch(err => {
                        this.$emit('error', { type: 'uplaod', message: err });
                        failure();
                    });
            },
            fileUpload (file, callback) {
                if (!this.validateFile(file)) return;
                const formData = new FormData();
                formData.append('file', file);
                this.http(formData)
                    .then(res => {
                        callback('', { title: file.name });
                        this.$emit('success', res);
                    })
                    .catch(err => {
                        this.$emit('error', { type: 'uplaod', message: err });
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
                if (failRule) {
                    this.$emit('error', { type: 'file', message: failRule.message });
                    tinymce.ui.MessageBox.alert(failRule.message);
                    return false;
                }
                return true;
            },
            validateImage (blobInfo, success, failure) {
                const rules = [
                    {
                        validator: () => typeof this.http === 'function',
                        message: '不支持上传图片'
                    },
                    {
                        validator: () => blobInfo.blob().size <= this.maxSize,
                        message: '图片大小超出上限'
                    },
                    {
                        validator: () => this.imageAccept.some(type => blobInfo.blob().type.search(type) !== -1),
                        message: '格式不符合要求'
                    }
                ];
                // 附加自定义验证规则
                rules.push(...this.imageRules || []);
                const failRule = rules.find(rule => !rule.validator(blobInfo.blob()));
                if (failRule) {
                    failure(failRule.message);
                    this.$emit('error', { type: 'image', message: failRule.message });
                    return false;
                }
                return true;
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
                    if (newVal !== this.editor.getContent()) this.editor.setContent(this.value);
                };
                this.unwatchValue = this.$watch('value', valueWatch, { immediate: true });
            },
            setEditorStyle () {
                const defaultStyle = `p {font-size: 14pt;font-family: FangSong; line-height: 1.5; margin: 0}`;
                this.editorStyle = {
                    default: defaultStyle,
                    standard: `
                        html { background-color: #eee}
                        body {
                            width: 210mm;
                            min-height: 247mm;
                            padding: 12mm 28mm;
                            margin: 16px auto;
                            box-shadow: 0 1px 4px rgba(10, 21, 42, .12);
                        }
                    ` + defaultStyle
                };
            }
        }
    };
</script>
