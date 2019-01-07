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
                    <SettingBtn @click.native="toggleSetting" />
                    <UserInfo />
                </div>
            </compontent>

            <ALayout class="layout-main" :style="{marginLeft: layoutMainLeft + 'px'}">
                <ALayoutHeader
                    v-if="isVertical"
                    :style="{paddingLeft: layoutMainHeaderLeft + 'px'}"
                    :class="{'header-fixed': isFixedHeader}"
                    class="layout-main-header"
                >
                    <div @click="toggleCollapsed" class="trigger v-icon-hover">
                        <AIcon :type="collapsed ? 'menu-unfold' : 'menu-fold'" />
                    </div>
                    <Breadcrumb />
                    <div class="header-tool">
                        <FullScreen />
                        <SettingBtn @click.native="toggleSetting" />
                        <UserInfo />
                    </div>
                </ALayoutHeader>
                <ALayoutContent :class="{'content-fixed-top': isFixedHeader}" class="layout-main-content">
                    <div v-if="!isVertical" class="horizontal-breadcrumb">
                        <Breadcrumb />
                    </div>
                    <KeepAlive :include="getAlive('BasicLayout')">
                        <RouterView />
                    </KeepAlive>
                </ALayoutContent>
                <Footer :delete-width="isVertical ? collapsedWidth : 0" />
            </ALayout>
        </ALayout>
        <Setting v-model="showSetting" />
    </div>
</template>

<script>
    import { mapState, mapGetters } from 'vuex';
    import Logo from './components/Logo';
    import UserInfo from './components/UserInfo';
    import FullScreen from './components/FullScreen';
    import Setting from './components/Setting';
    import SettingBtn from './components/SettingBtn';
    import Breadcrumb from './components/Breadcrumb';
    import Footer from './components/Footer';

    export default {
        name: 'BasicLayout',
        components: {
            Logo,
            SettingBtn,
            UserInfo,
            FullScreen,
            Setting,
            Breadcrumb,
            Footer
        },
        data () {
            return {
                // 菜单列表
                menuList: [],
                currentName: [this.$route.name],
                // 垂直布局下左侧菜单是否伸缩
                collapsed: false,
                // 侧边栏宽度
                siderWidth: 232,
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
                cacheOpenKeys: []
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
            ...mapGetters('app', ['getAlive']),
            layout () {
                return this.isVertical ? this.vertical : this.horizontal;
            },
            collapsedWidth () {
                return this.collapsed ? 80 : this.siderWidth;
            },
            // 垂直布局下侧边菜单伸缩，引起的右侧结构 marginLeft 伸缩变化
            layoutMainLeft () {
                return (this.isVertical && this.isFixedSider) ? this.collapsedWidth : 0;
            },
            // 垂直布局下固定导航菜单栏，侧边菜单伸缩，引起的右侧头部 marginLeft 伸缩变化
            layoutMainHeaderLeft () {
                return this.isFixedHeader ? this.collapsedWidth : 0;
            }
        },
        watch: {
            '$route.name': {
                handler (newVal) {
                    this.currentName.splice(0, 1, newVal);
                    this.setOpenKeys(this.menuList);
                    this.vertical.openKeys = this.$_unique(this.vertical.openKeys);
                }
            },
            collapsed () {
                [this.cacheOpenKeys, this.vertical.openKeys] = [this.vertical.openKeys, this.cacheOpenKeys];
            }
        },
        created () {
            this.setMenuList();
            this.setOpenKeys(this.menuList);
        },
        methods: {
            pushRouter ({ key }) {
                this.$router.push({ name: key });
            },
            setMenuList () {
                const mainRoute = this.$router.options.routes.find(i => i.name === this.$app.mainName);
                if (mainRoute && Array.isArray(mainRoute.children)) {
                    this.menuList = this.depthFilterMenu(mainRoute.children);
                }
            },
            depthFilterMenu (source) {
                return source
                    .filter(item => !(item.meta && item.meta.hideInMenu))
                    .map(item => {
                        let _temp = {};
                        if (item.meta) {
                            _temp.title = item.meta.title;
                            _temp.icon = item.meta.icon;
                        }
                        _temp.key = item.name;
                        if (Array.isArray(item.children) && item.children.length) {
                            _temp.children = this.depthFilterMenu(item.children);
                            // 当子级只有一个模块，将其提升一级并覆盖
                            if (_temp.children.length === 1) {
                                _temp = _temp.children[0];
                            }
                        }
                        return _temp;
                    });
            },
            // 设置当前页面在菜单中，从顶层到上一层的路径
            setOpenKeys (menu) {
                return menu.some(item => {
                    if (item.key === this.currentName[0]) {
                        return true;
                    }
                    this.vertical.openKeys.push(item.key);
                    if (Array.isArray(item.children) && this.setOpenKeys(item.children)) {
                        return true;
                    }
                    this.vertical.openKeys.pop();
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
            overflow: auto;
            z-index: 2;
        }

        .layout-main {
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
        // 若默认水平布局，顶级 ALayout 对是否有 Sider 识别错误，导致布局错位，对此手动修正
        flex-direction: column;

        .layout-header {
            padding: 0 16px;
            transition: all .2s;
            color: #fff;

            .menu {
                display: inline-block;
                line-height: 64px;
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
        height: 100vh;
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
        margin: 12px;
        overflow: initial;
    }

    .menu-theme-light {
        box-shadow: 0 1px 4px rgba(0, 21, 41, .08);
        background-color: #fff;

        /deep/ div, ul {
            color: rgba(0, 0, 0, .76);
        }
    }
</style>
