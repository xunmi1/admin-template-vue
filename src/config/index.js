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
     */
    baseUrl: {
        dev: 'https://lanaya.xycc.love/api/',
        pro: ''
    },
    /** @description token 验证
     * position:  token 放置位置
     * key token 键名
     */
    token: {
        // @enum 'headers'|'params' | 'data'
        position: 'headers',
        key: 'Authorization'
    },
    /**
     * @description 默认打开的首页的路由name值，默认为home
     */
    homeName: 'home',
});

export default config;
