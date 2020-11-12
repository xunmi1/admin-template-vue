<template>
  <div>
    <ALayout :class="isVertical ? 'vertical' : 'horizontal'" class="container">
      <Compontent
        :is="layout.menuLayout"
        v-model="collapsed"
        collapsible
        breakpoint="xl"
        :theme="menuTheme"
        :width="siderWidth"
        :class="menuClass"
        class="layout-sider layout-header"
      >
        <Logo :collapsed="collapsed" :theme="menuTheme" />
        <Menu
          :menu-data="menuList"
          :selected-keys="currentName"
          :open-keys="layout.openKeys"
          :mode="layout.mode"
          :theme="menuTheme"
          :class="[`menu-${isMenuRight ? 'right' : 'left'}`, 'menu']"
          @click="navigate"
          @openChange="changeOpenKeys"
        />
        <HeaderToolBar v-if="!isVertical" :theme="menuTheme" @click="toggleSetting" />
      </Compontent>

      <ALayout :style="{ marginLeft: layoutMainLeft + 'px' }" class="layout-main">
        <ALayoutHeader
          v-if="isVertical"
          :style="{ paddingLeft: layoutMainHeaderLeft + 'px' }"
          :class="{ 'header-fixed': isFixedHeader }"
          class="layout-main-header"
        >
          <div class="trigger v-icon-hover" @click="toggleCollapsed">
            <AIcon :type="collapsed ? 'menu-unfold' : 'menu-fold'" />
          </div>
          <Breadcrumb v-if="!isMobileDevice" />
          <HeaderToolBar theme="light" @click="toggleSetting" />
        </ALayoutHeader>
        <ALayoutContent :class="[{ 'content-fixed-top': isFixedHeader }, 'layout-main-content']">
          <div v-if="!isVertical" class="breadcrumb">
            <Breadcrumb />
          </div>
          <KeepAlive :include="getAlive('BasicLayout')">
            <RouterView />
          </KeepAlive>
        </ALayoutContent>
        <div :style="{ marginLeft: routerLayout.offsetLeft + 'px' }">
          <Footer :offset-left="isVertical ? siderWidth : 0" :start="2019" />
        </div>
      </ALayout>
    </ALayout>
    <Setting v-model="visibleOfSetting" />
    <BackTop />
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapState } from 'vuex';
import db, { StorageKeys } from '@/libs/db';
import { cache, getParentsFromTree, walkTree } from '@/libs/utils';
import { getVisibleTree } from './utils';

import screenMixin from './mixins/screenMixin';
import Menu from './components/Menu';
import Logo from './components/Logo';
import HeaderToolBar from './components/HeaderToolBar';
import Setting from './components/Setting';
import Breadcrumb from './components/Breadcrumb';
import Footer from './components/Footer';
import BackTop from './components/BackTop';

export const NOOP = () => {};

export default {
  name: 'BasicLayout',
  components: {
    MenuDrawer: () => import(/* webpackChunkName: "MenuDrawer" */ './components/MenuDrawer'),
    Menu,
    Logo,
    HeaderToolBar,
    Setting,
    Breadcrumb,
    Footer,
    BackTop,
  },
  mixins: [screenMixin],
  data() {
    return {
      currentName: [this.$route.name],
      // 垂直布局下左侧菜单是否伸缩
      collapsed: false,
      // 是否展示布局配置页
      visibleOfSetting: false,

      vertical: {
        openKeys: [],
        mode: 'inline',
        menuLayout: 'ALayoutSider',
      },
      horizontal: {
        openKeys: [],
        mode: 'horizontal',
        menuLayout: 'ALayoutHeader',
      },
      // 垂直布局下，菜单收缩，将展开的菜单选项缓存，再次打开后恢复
      cacheOpenKeys: [],
      // 因屏幕调整引起的布局切换，保存之前的布局方向
      cacheIsVertical: this.isVertical,
      // 手动点击跳转和路由的跳转，互斥
      isOpenKeysLock: false,
    };
  },
  computed: {
    ...mapState('app', {
      menuTheme: state => state.layout.menuTheme,
      isVertical: state => state.layout.isVertical,
      isFixedHeader: state => state.layout.isFixedHeader,
      isFixedSider: state => state.layout.isFixedSider,
      isMenuRight: state => state.layout.isMenuRight,
    }),
    ...mapGetters('app', ['getAlive', 'isMobileDevice']),
    layout() {
      return this.isVertical ? this.vertical : this.horizontal;
    },
    // 来自路由的布局信息
    routerLayout() {
      return this.$route.meta.layout ?? {};
    },
    // 侧边栏宽度
    siderWidth() {
      const minWidth = this.isMobileDevice ? 0 : 80;
      const maxWidth = Math.max(this.screenLevelMixin, 5) * 16 + 120;
      return this.collapsed ? minWidth : maxWidth;
    },
    // 垂直布局下侧边菜单伸缩，引起的右侧结构 marginLeft 伸缩变化
    layoutMainLeft() {
      const mainOffsetLeft = this.isVertical && this.isFixedSider && !this.isMobileDevice ? this.siderWidth : 0;
      this.setConstrainedBox({ mainOffsetLeft });
      return mainOffsetLeft;
    },
    // 垂直布局下固定导航菜单栏，侧边菜单伸缩，引起的右侧头部 marginLeft 伸缩变化
    layoutMainHeaderLeft() {
      return this.isFixedHeader && !this.isMobileDevice ? this.siderWidth : 0;
    },
    menuClass() {
      const { isVertical, isFixedHeader, isFixedSider, menuTheme } = this;
      return [
        { 'header-fixed': isFixedHeader && !isVertical },
        { 'sider-fixed': isFixedSider && isVertical },
        `theme-${menuTheme}`,
      ];
    },
  },
  watch: {
    // 路由发生变化时，生成新的菜单展开列表并合并
    '$route.name': {
      handler(newVal) {
        this.redirect();
        this.currentName.splice(0, 1, newVal);
        // 解锁, 减少没必要的计算
        if (this.isOpenKeysLock) return (this.isOpenKeysLock = false);
        this.vertical.openKeys = this.getOpenKeys(newVal);
      },
      immediate: true,
    },
    // 侧边栏伸缩时，交换菜单展开列表
    collapsed() {
      [this.cacheOpenKeys, this.vertical.openKeys] = [this.vertical.openKeys, this.cacheOpenKeys];
    },
    isMobileDevice: {
      handler(newVal) {
        if (newVal) {
          this.cacheIsVertical = this.isVertical;
          this.setLayout({ isVertical: true });
          this.vertical.menuLayout = 'MenuDrawer';
          this.collapsed = true;
        } else {
          this.setLayout({ isVertical: this.cacheIsVertical });
          this.vertical.menuLayout = 'ALayoutSider';
        }
      },
      immediate: true,
    },
  },
  beforeCreate() {
    // 菜单列表
    const transfer = v => ({ key: v.key, title: v.meta?.title });
    this.menuList = walkTree(transfer, getVisibleTree(this.$app.mainName));
  },
  created() {
    this.setLayout(db.get(StorageKeys.BASIC_LAYOUT));
    // 使具有缓存能力
    this.getOpenKeys = cache(this.getOpenKeys);
    // Note: `this.horizontal.openKeys` don't need extend
    this.vertical.openKeys = this.getOpenKeys(this.$route.name);
  },
  methods: {
    ...mapMutations('app', ['setLayout', 'setConstrainedBox']),
    navigate({ key }) {
      this.$router
        .push({ name: key })
        .catch(NOOP)
        .finally(() => (this.isOpenKeysLock = true));
    },
    // 如果当前路由在菜单中曾被替换，则需重定向到真正的路由地址
    redirect() {
      const name = this.$route.name;
      const target = this.menuList.find(v => v.originalKey === name);
      if (target) this.navigate({ key: target.key });
    },
    // 获取当前页面在菜单中，从顶层到上一层的路径
    getOpenKeys(current) {
      const list = getParentsFromTree(v => v.key === current, this.menuList).map(v => v.key);
      return list.length ? list : this.layout.openKeys;
    },
    toggleCollapsed() {
      this.collapsed = !this.collapsed;
    },
    toggleSetting() {
      this.visibleOfSetting = true;
    },
    // '手风琴' 模式，同时只展开一个子树菜单项 (不是一个菜单项)
    // 相反，可直接使用 '.sync' 修饰符即可
    changeOpenKeys(keys) {
      if (this.isVertical) {
        const openKeys = this.layout.openKeys;
        this.layout.openKeys = keys.filter(v => !openKeys.includes(v));
      } else {
        this.layout.openKeys = keys;
      }
    },
  },
};
</script>

<style lang="less" scoped>
@import '../../assets/style/variables.less';

@layout-sider-z-index: @zindex-modal - 10;
@layout-header-z-index: @zindex-modal - 20;

.container {
  min-height: 100vh;
}

.vertical {
  .layout-sider {
    overflow-y: auto;
    overflow-x: hidden;
    z-index: @layout-sider-z-index;
    .hidden-scrollbar();

    .menu {
      margin-bottom: @layout-trigger-height;
      border-right: none;
    }
  }

  .layout-main {
    transition: all 0.2s;

    &-header {
      .flex-row-center();
      background-color: #fff;
      padding: 0;
      transition: all 0.2s;
      box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

      .trigger {
        font-size: 20px;
        padding: 0 24px;
      }
    }
  }
}

.horizontal {
  /* fix: 水平布局下，顶级 `ALayout` 对是否有 `Sider` 识别错误，引起布局错位 */
  flex-direction: column;

  .layout-header {
    .flex-row-center();
    transition: all 0.2s;
    color: rgba(255, 255, 255, 0.85);

    .menu {
      .flex-row-center();
      flex: auto;
      overflow: hidden;

      &-right {
        justify-content: flex-end;
      }

      &-left {
        justify-content: flex-start;
      }

      /deep/ .ant-menu-item {
        line-height: @layout-header-height;
      }
    }
  }

  .breadcrumb {
    margin-bottom: 16px;
  }
}

.header-fixed {
  position: fixed;
  z-index: @layout-header-z-index;
  top: 0;
  right: 0;
  width: 100%;
  box-shadow: 0 2px 6px rgba(10, 21, 42, 0.1);
}

.sider-fixed {
  position: fixed;
  left: 0;
  height: 100%;
  box-shadow: 2px 0 6px rgba(10, 21, 42, 0.32);
}

.content-fixed-top {
  padding-top: @layout-header-height;
}

.layout-main-content {
  margin: 16px 16px 0;
  overflow: initial;
  @media screen and (max-width: 992px) {
    margin: 12px 0 0;
  }
}

.theme-light {
  box-shadow: 0 2px 6px rgba(0, 21, 41, 0.08);
  background-color: #fff;
}

.flex-row-center() {
  display: flex;
  align-items: center;
}

.hidden-scrollbar() {
  /* Firefox */
  scrollbar-width: none;

  /* Chrome */
  &::-webkit-scrollbar {
    width: 0;
    height: 0;
  }
}
</style>
