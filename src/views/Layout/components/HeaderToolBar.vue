<template>
  <div :class="`header-tool-theme-${theme}`" class="header-tool">
    <FullScreen class="action" />
    <SettingAction class="action" @click="openSetting" />
    <UserMenu class="action" />
  </div>
</template>

<script>
import FullScreen from './FullScreen';
import SettingAction from './SettingAction';
import UserMenu from './UserMenu';

export default {
  name: 'HeaderToolBar',
  components: {
    SettingAction,
    UserMenu,
    FullScreen,
  },
  props: {
    theme: {
      type: String,
      validator: value => ['dark', 'light'].includes(value),
      default: 'light',
    },
  },
  methods: {
    openSetting() {
      this.$emit('click', 'setting');
    },
  },
};
</script>

<style lang="less" scoped>
@import '../../../assets/style/variables.less';

.header-tool {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  margin-left: auto;

  &-theme {
    &-dark {
      .v-icon-hover:hover {
        cursor: pointer;
        color: white !important;
        background: @primary-color;
      }
    }

    &-light {
      .action {
        color: rgba(0, 0, 0, 0.76);
      }
    }
  }
}
</style>
