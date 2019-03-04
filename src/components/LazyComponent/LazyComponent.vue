<template>
    <transition-group
        v-bind="$attrs"
        v-on="$listeners"
        :tag="tag"
        :name="$attrs.name||'lazy-component'"
        :enter-class="$attrs.enterClass||'lazy-component-enter lazy-component-'+orientation"
        :leave-to-class="$attrs.leaveToClass||'lazy-component-leave-to lazy-component-'+orientation"
        style="position: relative;"
    >
        <div v-if="isInit" key="component">
            <slot :is-load="isBeforeInit" />
        </div>
        <div v-else-if="$slots.skeleton" key="skeleton">
            <slot name="skeleton" />
        </div>
        <div v-else key="isBeforeInit"></div>
    </transition-group>
</template>

<script>
    /**
     * 懒加载容器组件
     * 适用范围: 当前窗口显示不全完整页面，隐藏部分使用懒加载
     * 由于原开源项目维护停滞，因此提取
     * 参考 https://github.com/xunleif2e/vue-lazy-component
     */
    export default {
        name: 'LazyComponent',
        props: {
            tag: {
                type: String,
                default: 'div'
            },
            // 延迟（ms）, 将在指定 delay 时间后直接显示
            // 若设置，则窗口检验会失效
            delay: {
                type: Number,
                validator: value => value >= 0
            },
            // 可视窗口，默认使用浏览器视口
            viewport: {
                type: Object || window.HTMLElement
            },
            // 窗口检验的阀值，仅 viewport 未设置时可使用 '%'
            threshold: {
                type: String,
                default: '24px'
            },
            // 待加载组件所在方位，默认 'bottom': 位于下方
            // 会影响动画方向和窗口检测
            orientation: {
                type: String,
                validator: value => ['top', 'left', 'bottom', 'right'].includes(value),
                default: 'bottom'
            },
            // 最大等待时间
            maxWaitingTime: {
                type: Number,
                default: 120
            },
            // 是否阻止切换组件切换
            stop: Boolean,
        },
        data () {
            return {
                isInit: false,
                isBeforeInit: false
            };
        },
        computed: {
            rootMargin () {
                return ['top', 'bottom'].includes(this.orientation) ? `${ this.threshold } 0px` : `0px ${ this.threshold }`;
            }
        },
        created () {
            if (this.delay) {
                let timer = setTimeout(() => {
                    this.init();
                    clearTimeout(timer);
                    timer = null;
                }, this.delay);
            }
        },
        mounted () {
            if (!this.delay) {
                // 若不支持 IntersectionObserver, 将直接显示组件
                if (!IntersectionObserver) return this.init();
                // 观察视口与组件容器的交叉情况
                const observer = new IntersectionObserver(this.intersectionHandler, {
                    root: this.viewport,
                    rootMargin: this.rootMargin,
                    threshold: [0, 0.03, 0.06]
                });
                observer.observe(this.$el);
                this.$once('hook:beforeDestroy', function () {
                    // 在组件销毁前取消观察
                    if (observer) observer.unobserve(this.$el);
                });
            }
        },
        methods: {
            // IntersectionObserver 回调处理函数
            intersectionHandler (entries, observer) {
                if (entries[0].isIntersecting || entries[0].intersectionRatio) {
                    this.init();
                    if (!this.stop) observer.unobserve(this.$el);
                }
            },
            // 处理组件和骨架组件的切换
            init () {
                this.$emit('before-init');
                // 此时可以准备加载懒加载组件的资源
                this.isBeforeInit = true;
                // 由于函数会在主线程中执行，加载懒加载组件非常耗时，容易卡顿
                // 所以在requestAnimationFrame回调中延后执行
                this.requestAnimationFrame(() => {
                    this.isInit = !this.stop;
                    this.$emit('init', true);
                });
            },
            requestAnimationFrame (callback) {
                setTimeout(() => {
                    if (this.isInit) return;
                    callback();
                }, this.maxWaitingTime);
                const tempFn = window.requestAnimationFrame || (fn => setTimeout(fn, 1000 / 60 * 8));
                return tempFn(callback);
            }
        }
    };
</script>

<style lang="less" scoped>
    .lazy-component {
        &-enter, &-leave-to {
            opacity: 0;
        }

        &-enter-active {
            transition: all .6s ease .1s;
            position: absolute;
            top: 0;
            width: 100%;
        }

        &-leave-active {
            transition: all .32s ease .1s;
        }

        &-bottom {
            transform: translateY(24px);
        }

        &-top {
            transform: translateY(-24px);
        }

        &-right {
            transform: translateX(24px);
        }

        &-left {
            transform: translateX(-24px);
        }
    }
</style>
