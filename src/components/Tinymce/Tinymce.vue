<template>
    <label>
        <textarea :id="editorId">
            <slot />
        </textarea>
    </label>
</template>

<script>
    import defaultConfig from './tinymce.config';
    // Import TinyMCE
    import tinymce from 'tinymce/tinymce';
    import 'tinymce/themes/modern/theme';
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
    import 'tinymce/plugins/visualblocks';
    import 'tinymce/plugins/insertdatetime';
    import 'tinymce/plugins/contextmenu';
    import 'tinymce/plugins/wordcount';
    import 'tinymce/plugins/fullscreen';

    export default {
        props: {
            value: [String, Number],
            config: Object,
            http: Function,
            accept: { // 文件类型
                type: Array,
                default () {
                    return ['image/jpeg', 'image/png'];
                }
            },
            maxSize: { // 图片大小
                type: Number,
                default: 52428800
            }
        },
        data () {
            return {
                editorId: `editor${ Date.now() }`
            };
        },
        mounted () {
            if (!tinymce.get(this.editorId)) {
                this.init();
            }
        },
        beforeDestroy () {
            if (tinymce.get(this.editorId)) {
                tinymce.get(this.editorId).destroy();
            }
        },
        methods: {
            init () {
                // tinymce.baseURL = './tinymce';
                tinymce.suffix = '.min';
                const setting = {
                    selector: `#${ this.editorId }`,
                    setup: editor => {
                        editor.on('init', () => {
                            this.$emit('init', editor);
                            if (this.value) {
                                editor.setContent(this.value);
                            }
                        });
                    },
                    init_instance_callback: editor => {
                        editor.on('Input Undo Redo SetContent', () => {
                            this.$emit('input', editor.getContent());
                        });
                        editor.on('Focus', () => {
                            this.$emit('focus', editor);
                        });
                        editor.on('Blur', () => {
                            this.$emit('blur', editor);
                        });
                    },
                    // 图片上传
                    images_upload_handler: this.handleUpload
                };
                this.$nextTick(() => {
                    tinymce.init({ ...defaultConfig, ...setting, ...this.setting });
                });
            },
            beforeUpload (blobInfo, success, failure) {
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
                        validator: () => this.accept.toString().search(blobInfo.blob().type) >= 0,
                        message: '格式不符合要求'
                    }
                ];
                const failRule = rules.find(rule => !rule.validator());
                if (failRule) {
                    failure(failRule.message);
                    return false;
                }
                return true;
            },
            handleUpload (blobInfo, success, failure) {
                if (!this.beforeUpload(blobInfo, success, failure)) return;
                const formData = new FormData();
                formData.append('image', blobInfo.blob());
                this.http(formData).then(() => {
                    // success();
                }).catch(failure);
            }
        }
    };
</script>

<style scoped>
a {
    background-color: #e6e6e6;
}
</style>
