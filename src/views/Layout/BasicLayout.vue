<template>
    <div>
        <ALayout :class="isVertical ? 'vertical' : 'horizontal'" class="container">
            <compontent
                :is="layout.menuLayout"
                v-model="collapsed"
                collapsible
                breakpoint="xl"
                :theme="menuTheme"
                :width="siderWidth"
                :class="{
                    'header-fixed': !isVertical && isFixedHeader,
                    'sider-fixed': isVertical && isFixedSider,
                    'menu-theme-light' : menuTheme === 'light',
                    'menu-right' : isMenuRight,
                }"
                class="layout-sider layout-header"
            >
                <Logo :collapsed="collapsed" :theme="menuTheme" />
                <VMenu
                    :menu-data="menuList"
                    :selected-keys="currentName"
                    :open-keys.sync="layout.openKeys"
                    :mode="layout.mode"
                    :theme="menuTheme"
                    @click="pushRouter"
                    class="menu"
                />
                <div v-if="!isVertical" class="header-tool">
                    <FullScreen />
                    <SettingBtn @click="toggleSetting" />
                    <UserMenu />
                </div>
            </compontent>

            <ALayout :style="{marginLeft: layoutMainLeft + 'px'}" class="layout-main">
                <ALayoutHeader
                    v-if="isVertical"
                    :style="{paddingLeft: layoutMainHeaderLeft + 'px'}"
                    :class="{'header-fixed': isFixedHeader}"
                    class="layout-main-header"
                >
                    <div @click="toggleCollapsed" class="trigger v-icon-hover">
                        <AIcon :type="collapsed ? 'menu-unfold' : 'menu-fold'" />
                    </div>
                    <Breadcrumb v-if="!isMobileDevice" />
                    <div class="header-tool">
                        <FullScreen />
                        <SettingBtn @click="toggleSetting" />
                        <UserMenu />
                    </div>
                </ALayoutHeader>
                <ALayoutContent :class="[{'content-fixed-top': isFixedHeader}, 'layout-main-content']">
                    <div v-if="!isVertical" class="horizontal-breadcrumb">
                        <Breadcrumb />
                    </div>
                    <KeepAlive :include="getAlive('BasicLayout')">
                        <RouterView />
                    </KeepAlive>
                </ALayoutContent>
                <Footer :width="isVertical ? siderWidth : 0" />
            </ALayout>
        </ALayout>
        <Setting v-if="showSetting" v-model="showSetting" />
        <BackTop />
    </div>
</template>

<script>
    import { mapState, mapGetters, mapMutations } from 'vuex';
    import screenMixin from './mixins/screenMixin';
    import themeMixin from './mixins/themeMixin';
    import Logo from './components/Logo';
    import UserMenu from './components/UserMenu';
    import FullScreen from './components/FullScreen';
    import SettingBtn from './components/SettingBtn';
    import Breadcrumb from './components/Breadcrumb';
    import Footer from './components/Footer';
    import BackTop from './components/BackTop';

    const getMenuChildren = children =>
        Array.isArray(children) && children.filter(item => !(item.meta && item.meta.hideInMenu));

    export default {
        name: 'BasicLayout',
        components: {
            MenuDrawer: () => import(/* webpackChunkName: "MenuDrawer" */'./components/MenuDrawer'),
            Setting: () => import(/* webpackChunkName: "Setting" */'./components/Setting'),
            Logo,
            SettingBtn,
            UserMenu,
            FullScreen,
            Breadcrumb,
            Footer,
            BackTop
        },
        mixins: [screenMixin, themeMixin],
        data () {
            return {
                // 菜单列表
                menuList: [],
                currentName: [this.$route.name],
                // 垂直布局下左侧菜单是否伸缩
                collapsed: false,
                // 是否展示布局配置页
                showSetting: false,

                vertical: {
                    openKeys: [],
                    mode: 'inline',
                    menuLayout: 'ALayoutSider'
                },
                horizontal: {
                    openKeys: [],
                    mode: 'horizontal',
                    menuLayout: 'ALayoutHeader'
                },
                // 垂直布局下，菜单收缩，将展开的菜单选项缓存，再次打开后恢复
                cacheOpenKeys: [],
                // 因屏幕调整引起的布局切换，保存之前的布局方向
                cacheIsVertical: this.isVertical,
                // 手动点击跳转和路由的跳转，互斥
                isOpenKeysLock: false
            };
        },
        computed: {
            ...mapState('app', {
                menuTheme: state => state.layout.menuTheme,
                isVertical: state => state.layout.isVertical,
                isFixedHeader: state => state.layout.isFixedHeader,
                isFixedSider: state => state.layout.isFixedSider,
                isMenuRight: state => state.layout.isMenuRight
            }),
            ...mapGetters('app', ['getAlive', 'isMobileDevice']),
            layout () {
                return this.isVertical ? this.vertical : this.horizontal;
            },
            // 侧边栏宽度
            siderWidth () {
                const minWidth = this.isMobileDevice ? 0 : 80;
                const maxWidth = (Math.max(this.screenLevelMixin, 5) * 16) + 120;
                return this.collapsed ? minWidth : maxWidth;
            },
            // 垂直布局下侧边菜单伸缩，引起的右侧结构 marginLeft 伸缩变化
            layoutMainLeft () {
                return (this.isVertical && this.isFixedSider && !this.isMobileDevice) ? this.siderWidth : 0;
            },
            // 垂直布局下固定导航菜单栏，侧边菜单伸缩，引起的右侧头部 marginLeft 伸缩变化
            layoutMainHeaderLeft () {
                return (this.isFixedHeader && !this.isMobileDevice) ? this.siderWidth : 0;
            }
        },
        watch: {
            // 路由发生变化时，生成新的菜单展开列表并合并
            '$route.name': {
                handler (newVal) {
                    this.currentName.splice(0, 1, newVal);
                    // 解锁, 减少没必要的计算
                    if (this.isOpenKeysLock) return this.isOpenKeysLock = false;
                    this.vertical.openKeys = this.getOpenKeys(newVal);
                }
            },
            // 侧边栏伸缩时，交换菜单展开列表
            collapsed () {
                [this.cacheOpenKeys, this.vertical.openKeys] = [this.vertical.openKeys, this.cacheOpenKeys];
            },
            isMobileDevice: {
                handler (newVal) {
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
                immediate: true
            }
        },
        created () {
            this.setLayout(this.$db.get('layout'));
            this.setMenuList();
            // 使具有缓存能力
            this.getOpenKeys = this.$util.cached(this.getOpenKeys);
            this.vertical.openKeys = this.getOpenKeys(this.$route.name);
        },
        methods: {
            ...mapMutations('app', ['setLayout']),
            pushRouter ({ key }) {
                this.$router.push({ name: key });
                // 上锁
                this.isOpenKeysLock = true;
            },
            setMenuList () {
                const mainRoute = this.$router.options.routes.find(i => i.name === this.$app.mainName);
                if (mainRoute && Array.isArray(mainRoute.children)) {
                    this.menuList = this.getMenu(getMenuChildren(mainRoute.children));
                }
            },
            getMenu (source) {
                return source.map(item => {
                    let _temp = { ...(item.meta || {}), key: item.name };
                    const children = getMenuChildren(item.children);
                    if (children && children.length) {
                        _temp.children = this.getMenu(children);
                        // 当子级只有一个模块，将其提升一级并覆盖
                        if (_temp.children.length === 1) _temp = _temp.children[0];
                    }
                    return _temp;
                });
            },
            // 获取当前页面在菜单中，从顶层到上一层的路径
            getOpenKeys (current) {
                const path = [];
                this.findOpenKeys(path, current, this.menuList);
                if (!path.length) return this.vertical.openKeys;
                return path;
            },
            findOpenKeys (path, current, menu) {
                return menu.some(item => {
                    if (item.key === current) return true;
                    path.push(item.key);
                    if (!Array.isArray(item.children)) {
                        path.pop();
                        return false;
                    }
                    return this.findOpenKeys(path, current, item.children);
                });
            },
            toggleCollapsed () {
                this.collapsed = !this.collapsed;
            },
            toggleSetting () {
                this.showSetting = true;
            }
        }
    };
</script>

<style lang="less" scoped>
    .container {
        min-height: 100vh;
    }

    .vertical {
        .layout-sider {
            overflow-y: auto;
            overflow-x: hidden;
            z-index: 2;

            .menu {
                margin-bottom: 48px;
            }
        }

        .layout-main {
            transition: all .2s;

            &-header {
                background-color: #fff;
                padding: 0;
                transition: all .2s;
                border-bottom: 1px solid #e8e8e8;

                > div {
                    line-height: 64px;
                    display: inline-block;
                    vertical-align: top;
                }

                .trigger {
                    font-size: 20px;
                    padding: 0 24px;
                }
            }
        }
    }

    .horizontal {
        // 水平布局下，顶级 ALayout 对是否有 Sider 识别错误，导致布局错位，对此手动修正
        flex-direction: column;

        .layout-header {
            padding: 0 16px;
            transition: all .2s;
            color: #fff;

            .menu {
                display: inline-block;
                vertical-align: -.1rem;
            }
        }

        .menu-right {
            text-align: right;
        }

        &-breadcrumb {
            margin-bottom: 12px;
        }
    }

    .header-fixed {
        position: fixed;
        top: 0;
        right: 0;
        width: 100%;
        z-index: 1;
        box-shadow: 0 1px 4px rgba(10, 21, 42, .12);
    }

    .sider-fixed {
        position: fixed;
        left: 0;
        height: 100%;
        box-shadow: 2px 0 6px rgba(10, 21, 42, .32);
    }

    .content-fixed-top {
        padding-top: 64px;
    }

    .header-tool {
        display: inline-block;
        float: right;
        overflow: hidden;
    }

    .layout-main-content {
        margin: 16px 16px 0;
        overflow: initial;
        @media screen and (max-width: 992px) {
            margin: 12px 0 0;
        }
    }

    .menu-theme-light {
        box-shadow: 0 1px 4px rgba(0, 21, 41, .08);
        background-color: #fff;

        .header-tool {
            /deep/ div, ul {
                color: rgba(0, 0, 0, .76);
            }
        }
    }
</style>
