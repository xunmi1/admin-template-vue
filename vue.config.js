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
        port: 8888
    },
    configureWebpack: {
        plugins: [
            // antd 使用，精简 moment.js, 语言包只保留 zh-cn.js
            new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /zh-cn/),
            new AntDesignThemePlugin(options)
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

        // 修改针对 svg 的 loader (file-loader -> vue-svg-loader)
        // 当引入 svg 文件加入`?inline`, 会处理成 vue 组件
        const svgRule = config.module.rule('svg');
        svgRule.uses.clear();
        svgRule
            .oneOf('inline')
            .resourceQuery(/inline/)
            .use('vue-svg-loader')
            .loader('vue-svg-loader')
            .options({
                // https://github.com/svg/svgo
                svgo: {
                    plugins: [
                        { prefixIds: true },
                        { removeViewBox: false },
                        { removeDimensions: true }
                    ]
                }
            })
            .end()
            .end()
            .oneOf('external')
            .use('file-loader')
            .loader('file-loader')
            .options({
                name: 'assets/svg/[name].[hash:8].[ext]'
            });
    }
};
