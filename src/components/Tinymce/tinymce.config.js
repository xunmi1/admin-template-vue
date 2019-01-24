export default {
    language: 'zh_CN',
    max_height: 1000,
    min_height: 460,
    style_formats_merge: true,
    images_reuse_filename: true,

    plugins: [
        'paste lists advlist nonbreaking table autolink autosave link image imagetools charmap print preview anchor textcolor colorpicker',
        'searchreplace visualblocks code pagebreak',
        'insertdatetime contextmenu wordcount fullscreen'
    ],
    toolbar_items_size: 'small',
    toolbar: 'undo redo restoredraft paste | fontselect fontsizeselect | bold italic forecolor backcolor underline strikethrough | formatselect | alignleft aligncenter alignright alignjustify | bullist numlist | link unlink uploadimg image media | removeformat fullscreen',
    paste_retain_style_properties: 'all',
    paste_word_valid_elements: '*[*]',        // word
    paste_data_images: true,                  // 粘贴的同时能把内容里的图片自动上传
    paste_convert_word_fake_lists: false,     // 插入word文档需要该属性
    paste_webkit_styles: 'all',
    paste_merge_formats: true,
    paste_auto_cleanup_on_paste: false,
    branding: false,  // 禁止右下角标识
    image_advtab: true,
    autosave_interval: '20s',

    font_formats: `
        宋体=SimSun;
        黑体=SimHei;
        仿宋=FangSong;
        楷体=KaiTi;
        微软雅黑=Microsoft YaHei;
        隶书=LiSu;
        幼圆=YouYuan;
        Andale Mono=andale mono,times;
        Arial=arial,helvetica,sans-serif;
        Arial Black=arial black,avant garde;
        Book Antiqua=book antiqua,palatino;
        Comic Sans MS=comic sans ms,sans-serif;
        Courier New=courier new,courier;
        Georgia=georgia,palatino;
        Helvetica=helvetica;
        Impact=impact,chicago;
        Symbol=symbol;
        Tahoma=tahoma,arial,helvetica,sans-serif;
        Terminal=terminal,monaco;
        Times New Roman=times new roman,times;
        Trebuchet MS=trebuchet ms,geneva;
        Verdana=verdana,geneva;
        Webdings=webdings;
        Wingdings=wingdings,zapf dingbats
    `,
    fontsize_formats: '初号=44pt 小初=36pt 一号=26pt 小一=24pt 二号=22px 小二=18pt 三号=16pt 小三=15pt 四号=14pt 小四=12pt 五号=10.5pt 小五=9pt',
    content_style: `
        html {background-color: #e8e8e8}
        body {
            max-width: 210mm;
            min-height: 247mm;
            padding: 12mm 28mm; 
            margin:0 auto;
            box-shadow: 0 1px 4px rgba(10, 21, 42, .12); 
            lineHeight: 1.5
        }
    `,
    formats: {
        p: {
            selector : 'p, span, a, b',
            styles: { textIndent:'2em', fontSize: '14pt', lineHeight: '1.5', margin: '0' }
        }
    },
};
