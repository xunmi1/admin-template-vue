/**
 * 用来解决 webstorm (2018.3.2) 无法识别 '@' 文件路径等问题
 * 在设置 'Languages and Frameworks' -> 'JavaScript' -> 'Webpack' 中，加载本文件即可
 * 与项目无关，属于开发工具配置
 * @type {module:path}
 */
const path = require('path');

function resolve (dir) {
    return path.join(__dirname, '.', dir)
}

module.exports = {
    context: path.resolve(__dirname, './'),
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            '@': resolve('src'),
            '@c': resolve('src/components')
        }
    },
};
