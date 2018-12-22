module.exports = {
    runtimeCompiler: true,

    baseUrl: process.env.NODE_ENV === 'production'
        ? './'
        : '/',
    css: {
        modules: true
    },

    lintOnSave: true
};
