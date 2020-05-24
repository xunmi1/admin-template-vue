<template>
  <ATooltip :title="isFullScreen ? '退出全屏' : '全屏'">
    <div v-if="showAction" class="full-screen v-icon-hover" @click="handleToggle">
      <AIcon :type="isFullScreen ? 'fullscreen-exit' : 'fullscreen'" class="icon" />
    </div>
  </ATooltip>
</template>

<script>
const IS_IE = window.navigator.userAgent.search('MSIE') > -1;
const elm = document.documentElement;

const BrowserEventMap = [
  {
    event: 'fullscreen',
    listener: 'fullscreenchange',
    exit: document.exitFullscreen,
    full: elm.requestFullscreen,
  },
  {
    event: 'mozFullScreen',
    listener: 'mozfullscreenchange',
    exit: document.exitFullscreen || document.mozCancelFullScreen,
    full: elm.requestFullscreen || elm.mozRequestFullScreen,
  },
  {
    event: 'webkitIsFullScreen',
    listener: 'webkitfullscreenchange',
    exit: document.webkitCancelFullScreen,
    full: elm.webkitRequestFullScreen,
  },
];

/**
 * 不支持 IE
 * bug: 若页面默认是全屏状态，则切换无效
 */
export default {
  name: 'FullScreen',
  data() {
    return {
      showAction: !IS_IE,
      isFullScreen: false,
    };
  },
  mounted() {
    if (!this.showAction) return;
    this.$nextTick(() => {
      this.browser = BrowserEventMap.find(item => document[item.event]);
      this.showAction = !!this.showAction;
      if (this.browser) {
        document.addEventListener(this.browser.listener, this.changeFullScreen);
      }
    });
  },
  beforeDestroy() {
    if (this.browser) {
      document.removeEventListener(this.browser.listener, this.changeFullScreen);
    }
  },
  methods: {
    handleToggle() {
      if (this.isFullScreen) {
        this.browser.exit.call(document);
      } else {
        this.browser.full.call(document.documentElement);
      }
    },
    changeFullScreen() {
      this.isFullScreen = !!document[this.browser.event];
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
