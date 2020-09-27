<template>
  <ATooltip v-if="showAction" :title="isFullScreen ? '退出全屏' : '全屏'">
    <div class="full-screen v-icon-hover" @click="handleToggle">
      <AIcon :type="isFullScreen ? 'fullscreen-exit' : 'fullscreen'" class="icon" />
    </div>
  </ATooltip>
</template>

<script>
export const UA = window.navigator.userAgent.toLowerCase();
export const isIE = UA && /msie|trident/.test(UA);
const elm = document.documentElement;

const BrowserEventMap = [
  {
    enabled: document.fullscreenEnabled ?? document.fullscreen,
    listener: 'fullscreenchange',
    exit: document.exitFullscreen,
    full: elm.requestFullscreen,
  },
  {
    enabled: document.mozFullScreen,
    listener: 'mozfullscreenchange',
    exit: document.exitFullscreen ?? document.mozCancelFullScreen,
    full: elm.requestFullscreen ?? elm.mozRequestFullScreen,
  },
  {
    enabled: document.webkitIsFullScreen,
    listener: 'webkitfullscreenchange',
    exit: document.webkitCancelFullScreen,
    full: elm.webkitRequestFullScreen,
  },
];

const browser = BrowserEventMap.find(item => item.enabled);

export default {
  name: 'FullScreen',
  data() {
    return {
      showAction: !isIE && browser,
      isFullScreen: false,
    };
  },
  mounted() {
    if (!this.showAction) return;
    document.addEventListener(browser.listener, this.changeFullScreen);
  },
  beforeDestroy() {
    if (this.showAction) {
      document.removeEventListener(browser.listener, this.changeFullScreen);
    }
  },
  methods: {
    handleToggle() {
      if (this.isFullScreen) {
        browser.exit.call(document);
      } else {
        browser.full.call(elm);
      }
    },
    changeFullScreen() {
      this.isFullScreen = !this.isFullScreen;
      this.$emit('change', this.isFullScreen);
    },
  },
};
</script>

<style lang="less" scoped>
.full-screen {
  display: inline-block;

  .icon {
    padding: 0 12px;
    font-size: 16px;
    vertical-align: middle;
  }
}
</style>
