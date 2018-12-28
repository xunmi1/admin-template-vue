module.exports = {
    root: true,
    env: {
        node: true
    },
    'extends': [
        'plugin:vue/strongly-recommended',
        'eslint:recommended'
    ],
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'vue/html-indent': [
            'error', 4, {
                attribute: 1,
                baseIndent: 1,
                closeBracket: 0,
                alignAttributesVertically: true,
                ignores: []
            }
        ],
        'vue/max-attributes-per-line': ['error', {
            singleline: 4,
            multiline: {
                max: 1,
                allowFirstLine: false
            }
        }],
        'vue/script-indent': ['error', 4, {
            baseIndent: 1,
            switchCase: 0,
            ignores: []
        }],
        'vue/require-default-prop': 'off',
        'vue/singleline-html-element-content-newline': 'off',
        'vue/component-name-in-template-casing': ['error', 'PascalCase', {
            'ignores': ['compontent']
        }],

        indent: ['warn', 4]
    },
    overrides: [
        {
            files: ['*.vue'],
            rules: {
                indent: 'off'
            }
        }
    ],
    parserOptions: {
        parser: 'babel-eslint'
    }
};
