/**
 * 系统配置项，禁止运行时修改
 * @type {Readonly}
 */
const config = Object.freeze({
    /**
     * @description 配置显示在浏览器标签的title
     */
    title: {
        small: 'New System',
        main: 'New System'
    },
    /**
     * @description api请求基础路径
     */
    baseUrl: {
        dev: 'https://lanaya.xycc.love/api/',
        pro: ''
    },
    /** @description token 验证
     * position:  token 放置位置
     * key token 键名
     * expires 有效期, 单位: s
     */
    token: {
        // 'headers' | 'params' | 'data'
        position: 'headers',
        key: 'Authorization',
        expires: 36500 * 24 * 3600
    },
    /**
     * @description 登录页路由 name 值，默认为 'Login'
     */
    loginName: 'login',
    // 主体页面的 name 值，用于生成 menu 导航菜单
    mainName: 'main',
    // 本地存储前缀标识，建议不同系统自定义配置
    dbPrefix: 'newSystem',
    // 组织/公司/个人， 用于 footer
    org: 'Xunmi',
});

export default config;
