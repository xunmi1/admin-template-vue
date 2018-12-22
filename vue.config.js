module.exports = {
    runtimeCompiler: true,

    baseUrl: process.env.NODE_ENV === 'production'
        ? './'
        : '/',
    css: {
        modules: true
    },
    // 默认设置: https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-service/lib/config/base.js
    chainWebpack: config => {
        const entry = config.entry('app');
        // 判断环境加入模拟数据
        if (process.env.NODE_ENV !== 'production') {
            entry
                .add('@/mock')
                .end();
        }
    }
};
