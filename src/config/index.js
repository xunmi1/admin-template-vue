/**
 * 系统配置项，禁止运行时修改
 * @type {Readonly}
 */
const config = Object.freeze({
    /**
     * @description 配置显示在浏览器标签的title
     */
    title: {
        small: 'new system',
        main: 'new system'
    },
    /**
     * @description api请求基础路径
     * @type {dev: string, pro: string}
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
        expires: 4 * 3600
    },
    /**
     * @description 默认打开的首页的路由 name 值，默认为 'home'
     */
    homeName: 'home',
    /**
     * @description 登录页路由 name 值，默认为 'login'
     */
    loginName: 'login'
});

export default config;
