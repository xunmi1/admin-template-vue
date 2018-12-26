const webpack = require('webpack');
module.exports = {
    runtimeCompiler: true,

    baseUrl: process.env.NODE_ENV === 'production'
        ? './'
        : '/',
    css: {
        modules: true,
        loaderOptions: {
            less: {
                javascriptEnabled: true
            }
        }
    },
    configureWebpack: {
        plugins: [
            // antd 使用，精简 momentjs, 只保留 zh-cn.js
            new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /zh-cn/),
        ]
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
