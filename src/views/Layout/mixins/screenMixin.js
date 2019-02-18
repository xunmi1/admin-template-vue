const screenMixin = {
    data () {
        return {
            screenTypeMixin: 'xl',
            screenLevelMixin: 6
        };
    },
    created () {
        // 参考 Bootstrap(截至 v4.2) -> layout -> Responsive breakpoints
        this.breakpoints = [
            { minWidth: 1600, type: 'xxl', level: 8 },
            { minWidth: 1400, type: 'xl', level: 7 },
            { minWidth: 1200, type: 'xl', level: 6 },
            { minWidth: 992, type: 'lg', level: 5 },
            { minWidth: 768, type: 'md', level: 3.8 },
            { minWidth: 576, type: 'sm', level: 2.8 },
            { minWidth: 0, type: 'xs', level: 0 }
        ];
        this.$_screen_change();
        this.$_screen_change = this.$util.throttle(this.$_screen_change, 170, true);
        window.addEventListener('resize', this.$_screen_change);
    },
    beforeDestroy () {
        window.removeEventListener('resize', this.$_screen_change);
    },
    methods: {
        $_screen_change () {
            const screenWidth = Math.min(window.screen.width, document.body.clientWidth);
            this.breakpoints.some(point => {
                if (point.minWidth <= screenWidth) {
                    [this.screenTypeMixin, this.screenLevelMixin] = [point.type, point.level];
                    this.$store.commit('app/setScreenType', point);
                    return true;
                }
                return false;
            });
        }
    }
};

export default screenMixin;
