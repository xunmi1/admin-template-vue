const webpack = require('webpack');
const path = require('path');
const AntDesignThemePlugin = require('antd-theme-webpack-plugin');
const PACKAGE = require('./package.json');
const FAVICON = 'icons/android-chrome-192x192.png';
const resolve = dir => path.join(__dirname, dir);

// 复制 tinymce 所需的静态资源
const copyOptions = [
    {
        from: resolve('./src/components/Tinymce/langs'),
        to: './tinymce/langs',
    },
    {
        from: resolve('./node_modules/tinymce/skins'),
        to: './tinymce/skins',
    },
];
const themeOptions = {
    antDir: resolve('./node_modules/ant-design-vue'),
    stylesDir: resolve('./src/assets/style'),
    varFile: resolve('./src/assets/style/variables.less'),
    mainLessFile: resolve('./src/assets/style/index.less'),
    themeVariables: ['@primary-color'],
    indexFileName: false,
    generateOnce: false,
};

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
    runtimeCompiler: true,

    publicPath: isProduction ? './' : '/',
    productionSourceMap: false,

    css: {
        modules: true,
        sourceMap: !isProduction,
        loaderOptions: {
            less: {
                javascriptEnabled: true,
            },
        },
    },

    devServer: {
        port: 8888,
        open: true,
    },
    // @see https://github.com/vuejs/vue-docs-zh-cn/blob/master/vue-cli-plugin-pwa/README.md
    pwa: {
        themeColor: '#002140',
        msTileColor: '#002140',
        appleMobileWebAppCapable: 'yes',
        appleMobileWebAppStatusBarStyle: 'black',
        workboxPluginMode: 'InjectManifest',
        workboxOptions: {
            importWorkboxFrom: 'cdn',
            swDest: 'service-worker.js',
            swSrc: './serviceWorker/service-worker.js',
        },
        name: PACKAGE.name,
        iconPaths: {
            favicon32: FAVICON,
            favicon16: FAVICON,
            appleTouchIcon: FAVICON,
            maskIcon: FAVICON,
            msTileImage: FAVICON,
        },
    },

    configureWebpack: {
        plugins: [
            // antd 使用，精简 moment.js, 语言包只保留 zh-cn.js
            new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /zh-cn/),
            new AntDesignThemePlugin(themeOptions),
        ],
    },

    // @see https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-service/lib/config/base.js
    chainWebpack: config => {
        config.resolve.alias.set('@c', resolve('src/components'));
        // 修改 copy-webpack-plugin (modern 模式只会在第二次打包时复制，因此需要判断)
        const hasCopy = config.plugins.has('copy');
        if (hasCopy) config.plugin('copy').tap(args => [args[0].concat(copyOptions)]);

        const hasHtml = config.plugins.has('html');
        if (hasHtml) config.plugin('html').tap(args => {
            args[0].title = PACKAGE.name;
            return args;
        });

        // 修改针对 svg 的 loader (file-loader -> vue-svg-loader)
        // 当引入 svg 文件加入`?inline`后缀时, 会处理成 vue 组件
        const svgRule = config.module.rule('svg');
        svgRule.uses.clear();
        svgRule.oneOf('inline')
            .resourceQuery(/inline/).use('babel-loader').loader('babel-loader').end()
            .use('vue-svg-loader').loader('vue-svg-loader').options({
            // @see https://github.com/svg/svgo
            svgo: { plugins: [{ prefixIds: true }, { removeViewBox: false }, { removeDimensions: true }] },
        }).end().end()
            .oneOf('external')
            .use('file-loader')
            .loader('file-loader')
            .options({ name: 'assets/svg/[name].[hash:8].[ext]' });
    },
};
