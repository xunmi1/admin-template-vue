const mobileConfig = {
  toolbar: 'undo redo bold italic underline forecolor fontsizeselect styleselect table image link media fullscreen',
  toolbar_mode: 'scrolling',
};

const basicConfig = {
  mobile: mobileConfig,
  suffix: '.min',
  relative_urls: false, // 禁止自动转为相对路径（URL 将会自动转换为基于 document_base_url 的绝对路径）
  language: 'zh_CN',
  style_formats_merge: true, // 允许 style_formats 覆盖文本样式
  images_reuse_filename: true, // 使用图片的实际文件名
  contextmenu: false, // 禁用富文本的右键菜单
  paste_retain_style_properties: 'all', // 粘贴时保留所有样式
  paste_word_valid_elements: '*[*]', // 保留 word 样式
  paste_data_images: true, // 粘贴的同时把内容里的图片自动上传
  paste_webkit_styles: 'all', // 保留 webkit 样式
  branding: false, // 禁止右下角标识
  image_title: true,
  image_advtab: true, // 为图片添加高级选项设置
  automatic_uploads: true,
  autosave_interval: '20s', // 自动保存时长
  autosave_retention: '60m', // 本地存储时间上限
  pagebreak_split_block: true, // 分页符
  file_picker_types: 'file image media', // 文件上传的类型（将开启浏览本地文件的选项）
  font_formats: `
        宋体=SimSun;
        黑体=SimHei;
        仿宋=FangSong;
        楷体=KaiTi;
        微软雅黑=Microsoft YaHei;
        Arial=arial,helvetica,sans-serif;
        Comic Sans MS=comic sans ms,sans-serif;
        Courier New=courier new,courier;
        Georgia=georgia,palatino;
        Helvetica=helvetica;
        Symbol=symbol;
        Tahoma=tahoma,arial,helvetica,sans-serif;
        Times New Roman=times new roman,times;
        Wingdings=wingdings,zapf dingbats
    `,
  fontsize_formats:
    '初号=44pt 小初=36pt 一号=26pt 小一=24pt 二号=22pt 小二=18pt 三号=16pt 小三=15pt 四号=14pt 小四=12pt 五号=10.5pt 小五=9pt',
  formats: {
    p: {
      selector: 'p, span, a',
      styles: { textIndent: '2em', fontSize: '14pt', lineHeight: '1.5', margin: '0' },
    },
  },
};

export const classicConfig = Object.freeze({
  ...basicConfig,
  plugins:
    'paste lists advlist nonbreaking table autolink autosave link image media imagetools charmap print preview anchor searchreplace code pagebreak insertdatetime wordcount fullscreen help',
  menubar: 'file edit insert view format table tools help',
  toolbar:
    'undo redo | fontselect fontsizeselect | bold italic forecolor backcolor | alignleft aligncenter alignright alignjustify | numlist bullist | table image link unlink media fullscreen',
  // Note： v5.2.x `toolbar_mode` default is 'wrap'
  toolbar_mode: 'sliding',
  min_height: 480,
  help_tabs: ['shortcuts'],
});

export const inlineConfig = Object.freeze({
  ...basicConfig,
  inline: true,
  plugins: ['quickbars'],
  toolbar: false,
  menubar: false,
});
