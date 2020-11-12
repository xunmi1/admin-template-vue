import { deepFreeze } from '@/libs/utils';

/**
 * 系统配置项，禁止运行时修改
 * @type {Readonly}
 */
const config = deepFreeze({
  title: {
    small: 'Admin Template',
    main: 'Admin Template',
  },
  // 位于 public 目录下
  logoPath: 'icons/fire.svg',
  // api请求基础路径
  baseURL: '',
  // 静态资源 (例如图片、视频) 地址
  assetsURL: '',
  /**
   * key token 键名
   * value: 值模板，`TOKEN` 将替换为真实 token
   * expires 有效期, 单位: s
   */
  auth: {
    key: 'Authorization',
    template: 'Bearer TOKEN',
    expires: 7 * 24 * 3600,
  },
  // 登录页路由 name 值，默认为 'Login'
  loginName: 'Login',
  // 主体页面的 name 值，用于生成 menu 导航菜单
  mainName: 'Main',
  // 本地存储前缀标识，建议不同系统自定义配置
  dbPrefix: 'admin-template',
  // 组织/公司/个人， 用于 footer
  org: 'xunmi',
});

export default config;
