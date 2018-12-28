<template>
    <div v-if="showFullScreenBtn" @click="handleChange" class="full-screen icon-hover">
        <slot>
            <ATooltip :title="value ? '退出全屏' : '全屏'">
                <AIcon :type="value ? 'fullscreen-exit' : 'fullscreen'" class="full-screen-icon" />
            </ATooltip>
        </slot>
    </div>
</template>

<script>
    /**
     * 不支持 IE
     * bug: 若页面默认是全屏状态，则切换无效
     */
    export default {
        name: 'FullScreen',
        props: {
            value: {
                type: Boolean,
                default: false
            }
        },
        data () {
            return {
                showFullScreenBtn: true,
                browser: {}
            };
        },
        mounted () {
            this.showFullScreenBtn = window.navigator.userAgent.search('MSIE') < 0;
            if (!this.showFullScreenBtn) {
                return false;
            }
            const el = document.documentElement;
            const map = [
                {
                    event: 'fullScreen',
                    listener: 'fullscreenchange',
                    exit: document.exitFullscreen,
                    full: el.requestFullscreen
                },
                {
                    event: 'mozIsFullScreen',
                    listener: 'mozfullscreenchange',
                    exit: document.mozCancelFullScreen,
                    full: el.mozRequestFullScreen
                },
                {
                    event: 'webkitIsFullScreen',
                    listener: 'webkitfullscreenchange',
                    exit: document.webkitCancelFullScreen,
                    full: el.webkitRequestFullScreen
                },
            ];
            this.$nextTick(() => {
                this.browser = map.find(item => document[item.event] !== undefined);
                if (this.browser) {
                    this.showFullScreenBtn = true;
                    // 页面全屏判断无效
                    this.$emit('input', !!document[this.browser.event]);
                    document.addEventListener(this.browser.listener, this.bindScreenChange);
                }
            });
        },
        beforeDestroy() {
            document.removeEventListener(this.browser.listener, this.bindScreenChange);
        },
        methods: {
            handleChange () {
                if (this.value) {
                    this.browser.exit.call(document);
                } else {
                    this.browser.full.call(document.documentElement);
                }
            },
            bindScreenChange() {
                this.$emit('input', document[this.browser.event]);
            }
        }
    };
</script>

<style lang="less" scoped>
    .full-screen {
        display: inline-block;
        height: 100%;
        padding: 0 12px;

        &-icon {
            font-size: 18px;
            vertical-align: middle;
        }
    }
</style>
