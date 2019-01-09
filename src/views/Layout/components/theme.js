const updateTheme = primaryColor => {
    if (!primaryColor) {
        return;
    }
    (function buildIt () {
        if (!window.less) {
            return;
        }
        setTimeout(() => {
            window.less
                .modifyVars({
                    '@primary-color': primaryColor,
                })
                .then(data => {
                    console.log(data);
                })
                .catch(err => {
                    console.log(err);
                });
        }, 200);
    })();
};

const updateColorWeak = colorWeak => {
    colorWeak ? document.body.classList.add('colorWeak') : document.body.classList.remove('colorWeak');
};

export { updateTheme, updateColorWeak };
