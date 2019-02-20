/* eslint-disable */
// https://github.com/vuejs/vue-cli/issues/1879

module.exports = {
    moduleFileExtensions: [
        'js',
        'jsx',
        'json',
        'vue'
    ],
    transform: {
        '^.+\\.vue$': 'vue-jest',
        '.+\\.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2)$': 'jest-transform-stub',
        '^.+\\.jsx?$': 'babel-jest',
        '^.+\\.svg\\?inline$': '<rootDir>/tests/svgTransform.js'
    },

    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
        '^@c/(.*)$': '<rootDir>/src/components/$1'
    },
    snapshotSerializers: [
        'jest-serializer-vue'
    ],
    testMatch: [
        '**/tests/unit/**/*.spec.(js|jsx|ts|tsx)|**/__tests__/*.(js|jsx|ts|tsx)'
    ],
    testURL: 'http://localhost/',

    collectCoverage: true,
    collectCoverageFrom: [
        'src/components/**/*.{js,vue}'
    ]
};
