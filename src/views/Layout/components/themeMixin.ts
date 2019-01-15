const themeMixin = {
    data () {
        return {
            themeList: [
                {
                    text: '薄暮', name: 'dust-red', variables: {
                        '@primary-color': '#f5222d'
                    }
                },
                {
                    text: '金盏花', name: 'alendula-gold', variables: {
                        '@primary-color': '#faad14'
                    }
                },
                {
                    text: '极光绿', name: 'polar-green', variables: {
                        '@primary-color': '#52C41A'
                    }
                },
                {
                    text: '明青', name: 'cyan', variables: {
                        '@primary-color': '#13C2C2'
                    }
                },
                {
                    text: '拂晓蓝', name: 'daybreak-blue', variables: {
                        '@primary-color': '#1890FF'
                    }
                },
                {
                    text: '酱紫', name: 'golden-purple', variables: {
                        '@primary-color': '#722ED1'
                    }
                }
            ]
        };
    },
    watch: {
        theme: {
            handler (newVal, oldVal) {
                this.$_theme_updateTheme(newVal, oldVal);
            }
        }
    },
    created () {
        // 防抖
        this.$_theme_updateTheme = this.$_throttle(this.$_theme_updateTheme, 1200, true);
    },
    methods: {
        $_theme_updateTheme (newTheme) {
            const theme = this.themeList.find(item => item.name === newTheme);
            if (!theme && !window.less) {
                return;
            }
            window.less
                .modifyVars(theme.variables)
                .then(() => {
                    this.$_theme_updateClass(newTheme);
                })
                .catch(() => {
                    this.$message.error('主题更换失败！');
                });
        },
        $_theme_updateClass (newClass) {
            // 由于防抖，实际 DOM 上旧 class 已无法获知, 因此循环移除
            this.themeList.forEach(item => document.body.classList.remove(item.name));
            document.body.classList.add(newClass);
        }
    }
};

export default themeMixin;
