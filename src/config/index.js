/**
 * 系统配置项，禁止运行时修改
 * @type {Readonly}
 */
import { deepFreeze } from '../libs/common/util';

const config = deepFreeze({
    /**
     * @description 配置显示在浏览器标签的title
     */
    title: {
        small: 'New System',
        main: 'New System'
    },
    // 位于 public 目录下
    logoPath: 'logo/fire.svg',
    /**
     * @description api请求基础路径
     */
    baseUrl: {
        development: 'https://lanaya.xycc.love/api/',
        production: ''
    },
    // api 接口版本
    apiVersion: '',
    /** @description token 验证
     * position:  token 放置位置
     * key token 键名
     * value: 值模板，`TOKEN` 将替换为真实 token
     * expires 有效期, 单位: s
     */
    token: {
        // 'headers' | 'params' | 'data'
        position: 'headers',
        key: 'Authorization',
        value: 'Bearer TOKEN',
        expires: 7 * 24 * 3600
    },
    /**
     * @description 登录页路由 name 值，默认为 'Login'
     */
    loginName: 'Login',
    // 主体页面的 name 值，用于生成 menu 导航菜单
    mainName: 'Main',
    // 本地存储前缀标识，建议不同系统自定义配置
    dbPrefix: 'newSystem',
    // 组织/公司/个人， 用于 footer
    org: 'Xunmi'
});

export default config;
