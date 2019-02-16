const screenMixin = {
    data () {
        return {
            screenTypeMixin: 'xl',
            screenLevelMixin: 6
        };
    },
    created () {
        this.$_screen_change = this.$util.throttle(this.$_screen_change, 200, true);
        // 参考 Bootstrap(截至 v4.2) -> layout -> Responsive breakpoints
        this.breakpoints = [
            { minWidth: 1600, type: 'xxl', level: 8 },
            { minWidth: 1200, type: 'xl', level: 6 },
            { minWidth: 992, type: 'lg', level: 5 },
            { minWidth: 768, type: 'md', level: 4 },
            { minWidth: 576, type: 'sm', level: 3 },
            { minWidth: 0, type: 'xs', level: 0 }
        ];
    },
    mounted () {
        window.addEventListener('resize', this.$_screen_change);
        this.$_screen_change();
    },
    beforeDestroy () {
        window.removeEventListener('resize', this.$_screen_change);
    },
    methods: {
        $_screen_change () {
            const { type, level } = this.breakpoints.find(item => window.matchMedia(`(min-width: ${ item.minWidth }px)`).matches);
            [this.screenTypeMixin, this.screenLevelMixin] = [type, level];
        }
    }
};

export default screenMixin;
