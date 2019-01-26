<template>
    <div v-if="showFullScreenBtn" @click="handleToggle" class="full-screen v-icon-hover">
        <slot :isFullScreen="isFullScreen">
            <ATooltip :title="isFullScreen ? '退出全屏' : '全屏'">
                <div>
                    <AIcon :type="isFullScreen ? 'fullscreen-exit' : 'fullscreen'" class="full-screen-icon" />
                </div>
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
        data () {
            return {
                showFullScreenBtn: true,
                isFullScreen: false
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
                    event: 'fullscreen',
                    listener: 'fullscreenchange',
                    exit: document.exitFullscreen,
                    full: el.requestFullscreen
                },
                {
                    event: 'mozFullScreen',
                    listener: 'mozfullscreenchange',
                    exit: document.exitFullscreen || document.mozCancelFullScreen,
                    full: el.requestFullscreen || el.mozRequestFullScreen
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
                    this.isFullScreen = !!document[this.browser.event];
                    this.$emit('change', this.isFullScreen);
                    document.addEventListener(this.browser.listener, this.bindScreenToggle);
                } else {
                    this.showFullScreenBtn = false;
                }
            });
        },
        beforeDestroy() {
            document.removeEventListener(this.browser.listener, this.bindScreenToggle);
        },
        methods: {
            handleToggle () {
                if (this.isFullScreen) {
                    this.browser.exit.call(document);
                } else {
                    this.browser.full.call(document.documentElement);
                }
            },
            bindScreenToggle() {
                this.isFullScreen = !!document[this.browser.event];
                this.$emit('change', this.isFullScreen);
            }
        }
    };
</script>

<style lang="less" scoped>
    .full-screen {
        display: inline-block;
        height: 100%;
        &-icon {
            padding: 0 12px;
            font-size: 16px;
            vertical-align: middle;
        }
    }
</style>
