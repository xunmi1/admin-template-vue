<template>
  <ADrawer :visible="visible" :width="286" class="setting" title="界面设置" @close="onClose">
    <div class="setting-option-mb">
      <h4 class="setting-title">导航菜单风格</h4>
      <ATooltip title="暗色">
        <div class="setting-layout" @click="toggle('menuTheme', 'dark')">
          <LayoutDarkSVG v-once class="setting-svg" />
          <AIcon v-show="menuTheme === 'dark'" class="check-icon v-theme-color" type="check" />
        </div>
      </ATooltip>
      <ATooltip title="亮色">
        <div class="setting-layout" @click="toggle('menuTheme', 'light')">
          <LayoutLightSVG v-once class="setting-svg" />
          <AIcon v-show="menuTheme === 'light'" class="check-icon v-theme-color" type="check" />
        </div>
      </ATooltip>
    </div>
    <div>
      <h4 class="setting-title">导航菜单布局</h4>
      <ATooltip title="侧边菜单">
        <div class="setting-layout" @click="toggle('isVertical', true)">
          <VerticalSVG v-once class="setting-svg" />
          <AIcon v-show="isVertical" class="check-icon v-theme-color" type="check" />
        </div>
      </ATooltip>
      <ATooltip title="顶部菜单">
        <div
          :class="{ 'setting-layout': true, 'v-disabled': isMobileDevice }"
          @click="isMobileDevice ? null : toggle('isVertical', false)"
        >
          <HorizontalSVG v-once class="setting-svg" />
          <AIcon v-show="!isVertical" class="check-icon v-theme-color" type="check" />
        </div>
      </ATooltip>
      <ADivider />
    </div>
    <div class="setting-option-mb">
      <span class="setting-title">固定导航栏</span>
      <ASwitch :checked="isFixedHeader" class="setting-switch" @change="toggle('isFixedHeader', $event)" />
    </div>
    <div class="setting-option-mb">
      <ATooltip :title="!isVertical ? '侧边菜单时可配置' : null" placement="left">
        <span class="setting-title">固定左侧菜单</span>
        <ASwitch
          :checked="isFixedSider"
          :disabled="!isVertical"
          class="setting-switch"
          @change="toggle('isFixedSider', $event)"
        />
      </ATooltip>
    </div>
    <div>
      <ATooltip :title="isVertical ? '顶部菜单时可配置' : null" placement="left">
        <span class="setting-title">水平菜单靠右</span>
        <ASwitch
          :checked="isMenuRight"
          :disabled="isVertical"
          class="setting-switch"
          @change="toggle('isMenuRight', $event)"
        />
      </ATooltip>
    </div>
  </ADrawer>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex';
import db, { StorageKeys } from '@/libs/db';
import LayoutLightSVG from '@/assets/svg/layout-light.svg?inline';
import LayoutDarkSVG from '@/assets/svg/layout-dark.svg?inline';
import VerticalSVG from '@/assets/svg/layout-vertical.svg?inline';
import HorizontalSVG from '@/assets/svg/layout-horizontal.svg?inline';

export default {
  name: 'Setting',
  components: {
    LayoutLightSVG,
    LayoutDarkSVG,
    VerticalSVG,
    HorizontalSVG,
  },
  model: {
    prop: 'visible',
    event: 'change',
  },
  props: {
    visible: Boolean,
  },
  computed: {
    ...mapState('app', {
      menuTheme: state => state.layout.menuTheme,
      isVertical: state => state.layout.isVertical,
      isFixedHeader: state => state.layout.isFixedHeader,
      isFixedSider: state => state.layout.isFixedSider,
      isMenuRight: state => state.layout.isMenuRight,
      theme: state => state.layout.theme,
    }),
    ...mapGetters('app', ['isMobileDevice']),
  },
  methods: {
    ...mapMutations('app', ['setLayout']),
    toggle(type, value) {
      if (this[type] !== undefined && this[type] !== value) {
        this.setLayout({ [type]: value });
      }
    },
    onClose() {
      const settingItems = ['menuTheme', 'isVertical', 'isFixedHeader', 'isFixedSider', 'isMenuRight', 'theme'];
      const data = settingItems.reduce((obj, key) => ({ ...obj, [key]: this[key] }), {});
      this.$emit('change', false);
      db.set(StorageKeys.BASIC_LAYOUT, data);
    },
  },
};
</script>

<style lang="less" scoped>
.setting {
  &-title {
    font-size: 14px;
    line-height: 22px;
    margin: 0;
    padding-bottom: 12px;
  }

  &-svg {
    width: 68px;
    height: 56px;
  }

  &-layout {
    position: relative;
    display: inline-block;
    margin-right: 18px;
    cursor: pointer;

    .check-icon {
      position: absolute;
      left: 38px;
      bottom: 14px;
      font-size: 18px;
    }
  }

  &-option-mb {
    margin-bottom: 24px;
  }

  &-theme {
    list-style: none;

    > li {
      display: inline-block;
      width: 28px;
      height: 28px;
      border-radius: 4px;
      vertical-align: middle;
    }

    li + li {
      margin-left: 10px;
    }

    .check-icon {
      vertical-align: middle;
      font-size: 18px;
      color: #fff;
    }
  }

  &-switch {
    float: right;
  }
}
</style>
