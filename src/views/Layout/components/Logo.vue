<template>
  <section :class="[isVertical ? 'logo-vertical' : 'logo-horizontal', `logo-theme-${theme}`]">
    <img v-if="logoPath" v-once :src="logoPath" alt="图标" height="36" width="36" />
    <h1 v-show="title" class="title">{{ title }}</h1>
  </section>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'Logo',
  props: {
    collapsed: Boolean,
    theme: {
      type: String,
      validator: value => ['dark', 'light'].includes(value),
      default: 'light',
    },
  },
  data() {
    return {
      title: this.$app.title.small,
    };
  },
  computed: mapState('app', {
    isVertical: state => state.layout.isVertical,
  }),
  watch: {
    collapsed(bool) {
      if (!this.isVertical) return;
      if (bool) return (this.title = null);
      setTimeout(() => (this.title = this.$app.title.small), 168);
    },
  },
  created() {
    const publicPath = process.env.BASE_URL;
    this.logoPath = this.$app.logoPath && publicPath + this.$app.logoPath;
  },
};
</script>

<style lang="less" scoped>
@import '../../../assets/style/variables.less';

.logo-layout() {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.logo {
  &-vertical {
    .logo-layout();
    height: @layout-header-height;

    .title {
      font-size: 20px;
      line-height: 1.5;
      /* supplement chinese characters position centered */
      margin: 0 0 2px 8px;
    }
  }

  &-horizontal {
    .logo-layout();
    flex-shrink: 0;
    margin-right: 24px;

    .title {
      font-size: 18px;
      margin: 0 0 2px 12px;
    }
  }

  &-theme {
    &-dark {
      &.logo-vertical {
        background-color: @layout-trigger-background;
      }

      .title {
        color: #fff;
      }

      .v-icon-hover:hover {
        cursor: pointer;
        color: white;
        background: @primary-color;
      }
    }

    &-light {
      .title {
        color: @layout-trigger-background;
      }
    }
  }
}
</style>
