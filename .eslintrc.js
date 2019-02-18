module.exports = {
    root: true,
    env: {
        node: true
    },
    extends: [
        'plugin:vue/strongly-recommended',
        'eslint:recommended'
    ],
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',

        // vue 组件
        'vue/html-indent': [
            'error', 4, {
                attribute: 1,
                baseIndent: 1,
                closeBracket: 0,
                alignAttributesVertically: true,
                ignores: []
            }
        ],
        // 标签属性一行超过 4 个，必须换行对齐
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
        // 自定义组件、svg、MathML 没内容时自我闭合
        "vue/html-self-closing": ["error", {
            "html": {
                "void": "never",
                "normal": "any",
                "component": "always"
            },
            "svg": "always",
            "math": "always"
        }],
        // 组件 prop 必须有默认值，没必要限制
        'vue/require-default-prop': 'off',
        'vue/singleline-html-element-content-newline': 'off',
        // 组件必须使用大驼峰命名
        'vue/component-name-in-template-casing': ['error', 'PascalCase', {
            'ignores': ['compontent', 'transition']
        }],
        'vue/html-end-tags': 'off',
        // 组件的 data 属性的值必须是一个函数, 没必要限制
        'vue/no-shared-component-data': 'off',
        // 组件的属性必须为一定的顺序，方便阅读
        'vue/order-in-components': 'error',
        'vue/eqeqeq': 'error',

        // js 部分
        'indent': ['warn', 4],
        'no-eval': 'error',
        'no-with': 'error',
        // 都 new Date().getFullYear() 年了，禁止使用 var ！！！
        'no-var': 'error',
        // 必须使用 === 或 !==， 除非比较 null
        'eqeqeq': ["error", "always", {"null": "ignore"}],
        'for-direction': 'error',
        'no-invalid-regexp': 'error',
        // 禁止使用特殊空白符
        'no-irregular-whitespace': 'error',
        // 禁止在 return, throw, break 或 continue 之后还有代码
        'no-unreachable': 'error',
        'no-unsafe-finally': 'error',
        'use-isnan': 'error',
        'valid-typeof': 'error',
        // 数组的方法除了 forEach 之外，回调函数必须有返回值
        'array-callback-return': 'error',
        // 禁止函数的循环复杂度超过 20, 例如连续 20 个 if 判断
        'complexity': 'error',
        // 禁止使用位运算符，除非 !!
        'no-implicit-coercion': ['error', { "allow": ["!!"] } ],
        'no-labels': 'error',
        'no-new-func': 'error',
        // 禁止在 if 中声明函数
        'no-inner-declarations': 'error',
        // 禁止在循环内的函数中, 出现循环体条件语句中定义的变量
        'no-loop-func': 'error',
        'no-self-compare': 'error',
        'no-delete-var': 'error',
        'func-names': 'off',
        // new 后面必须大写
        'new-cap': 'error',
        'require-await': 'off',
        'no-script-url': 'error',
        // for in 内部必须有 hasOwnProperty
        'guard-for-in': 'error',
        // 禁止修改原生对象
        'no-extend-native': 'error',
        // 禁止无用的表达式
        'no-unused-expressions': 'error',
        // 定义过的变量必须使用
        'no-unused-vars': 'error'
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
