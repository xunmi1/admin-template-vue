const themeMixin = {
    data() {
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
            ],
        }
    },
    methods: {
        updateTheme(themeName) {
            if (!themeName && !window.less) {
                return;
            }
            const theme = this.themeList.find(item => item.name === themeName);
            setTimeout(() => {
                window.less
                    .modifyVars(theme.variables)
                    .then(data => {
                        console.log(data);
                    })
                    .catch(err => {
                        console.log(err);
                    });
            }, 200);
        },
        updateClass(newClass, oldClass) {
            document.body.classList.add(newClass);
            document.body.classList.remove(oldClass);
        }
    }
};
export default themeMixin;
