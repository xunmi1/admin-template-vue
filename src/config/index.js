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
        dev: './api/',
        pro: ''
    },
    /**
     * @description 默认打开的首页的路由name值，默认为home
     */
    homeName: 'home',
});

export default config;
