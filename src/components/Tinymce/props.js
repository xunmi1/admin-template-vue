// 检测平台的颜色方案是是否为暗色
const PLATFORM_IS_DARK = window.matchMedia('(prefers-color-scheme: dark)').matches;

export default {
  value: [String, Number],
  // 唯一 key 值
  editorKey: [Number, String],
  // 是否可见
  visible: {
    type: Boolean,
    default: true,
  },
  // 模式 'classic' | 'inline'
  mode: {
    type: String,
    validator: value => ['inline', 'classic'].includes(value),
    default: 'classic',
  },
  // 是否为手机端（在 mode = 'default'下，tinyMCE 会自动判断，这里是功能上调整）
  isMobile: {
    type: Boolean,
    default: false,
  },
  // 内容区显示模式，对应 `config.content_css` 字段
  contentMode: {
    type: String,
    validator: value => ['dark', 'document', 'writer', 'default'].includes(value),
    default: PLATFORM_IS_DARK ? 'dark' : 'default',
  },
  // 皮肤，可选 'light' | 'dark'
  skin: {
    type: String,
    validator: value => ['light', 'dark'].includes(value),
    default: PLATFORM_IS_DARK ? 'dark' : 'light',
  },
  // 富文本配置项，会覆盖和并默认配置
  config: Object,
  // 上传 http 方法
  http: Function,
  // 图片接受类型
  imageAccept: {
    type: Array,
    default: () => ['image/*'],
  },
  // 文件接受类型
  fileAccept: {
    type: Array,
    default: () => [
      '.txt',
      '.docx',
      '.doc',
      '.xlsx',
      '.xls',
      '.csv',
      '.pptx',
      '.ppt',
      '.pdf',
      '.zip',
      '.rar',
      '.md',
      'image/*',
    ],
  },
  // 图片大小上限
  maxSize: {
    // 图片大小
    type: Number,
    default: 52428800,
  },
  // 图片验证规则
  imageRules: {
    type: Array,
    validator: rules => Array.isArray(rules) && rules.every(rule => typeof rule.validator === 'function'),
  },
  // 文件验证规则
  fileRules: {
    type: Array,
    validator: rules => Array.isArray(rules) && rules.every(rule => typeof rule.validator === 'function'),
  },
  // 文本自动保存到 localStorage 的键名前缀
  autoSavePrefix: {
    type: String,
    default: 'tinymce-autosave-{path}{query}-{id}-',
  },
  // 富文本所需的静态资源
  baseURL: {
    type: String,
    default: './tinymce',
  },
};
