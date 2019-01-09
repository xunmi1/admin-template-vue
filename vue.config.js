const webpack = require('webpack');
const path = require('path');
const AntDesignThemePlugin = require('antd-theme-webpack-plugin');
const resolve = dir => {
    return path.join(__dirname, dir);
};

const options = {
    antDir: resolve('./node_modules/ant-design-vue'),
    stylesDir: resolve('./src/assets/style'),
    varFile: resolve('./src/assets/style/variables.less'),
    mainLessFile: resolve('./src/assets/style/index.less'),
    themeVariables: ['@primary-color'],
    indexFileName: './public/index.html',
    generateOnce: false
};

const themePlugin = new AntDesignThemePlugin(options);
module.exports = {
    runtimeCompiler: true,

    publicPath: process.env.NODE_ENV === 'production'
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
    devServer: {
        open: true,
        port: 8888
    },
    configureWebpack: {
        plugins: [
            // antd 使用，精简 momentjs, 只保留 zh-cn.js
            new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /zh-cn/),
            themePlugin
        ]
    },
    // 默认设置: https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-service/lib/config/base.js
    chainWebpack: config => {
        config.resolve.alias.set('@c', resolve('src/components'));
        const entry = config.entry('app');
        // 判断环境加入模拟数据
        if (process.env.NODE_ENV !== 'production') {
            entry
                .add('@/mock')
                .end();
        }
    }
};
