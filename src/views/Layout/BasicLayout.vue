<template>
    <div>
        <ALayout :class="isVertical ? 'vertical' : 'horizontal'" class="container">
            <compontent
                :is="layout.menuLayout"
                v-model="collapsed"
                collapsible
                breakpoint="xl"
                :theme="menuTheme"
                :class="{
                    'header-fixed': !isVertical && isFixedHeader,
                    'sider-fixed': isVertical && isFixedSider,
                    'menu-theme-light' : menuTheme === 'light',
                }"
                class="layout-sider layout-header"
            >
                <VMenu
                    :menu-data="menuList"
                    :default-selected-keys="[currentName]"
                    :mode="layout.mode"
                    :theme="menuTheme"
                    class="menu"
                />
                <div v-if="!isVertical" class="header-tool">
                    <FullScreen />
                    <SettingBtn @click.native="showDrawer" />
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
                    <AIcon
                        class="trigger icon-hover"
                        :type="collapsed ? 'menu-unfold' : 'menu-fold'"
                        @click="changeCollapsed"
                    />
                    <div class="header-tool">
                        <FullScreen />
                        <SettingBtn @click.native="showDrawer" />
                        <UserInfo />
                    </div>
                </ALayoutHeader>
                <ALayoutContent :class="{'content-fixed-top': isFixedHeader}" class="layout-main-content">
                    <KeepAlive include="aliveList">
                        <RouterView />
                    </KeepAlive>
                </ALayoutContent>
            </ALayout>
        </ALayout>
        <Setting v-model="showSetting" />
    </div>
</template>

<script>
    import { mapState, mapMutations } from 'vuex';
    import UserInfo from './components/UserInfo';
    import FullScreen from './components/FullScreen';
    import Setting from './components/Setting';
    import SettingBtn from './components/SettingBtn';

    export default {
        name: 'BasicLayout',
        components: {
            SettingBtn,
            UserInfo,
            FullScreen,
            Setting
        },
        data () {
            return {
                // 主页面的所有路由
                mainRoutes: [],
                // 菜单列表
                menuList: [],
                // 垂直布局下左侧菜单是否伸缩
                collapsed: false,
                // 是否展示布局配置页
                showSetting: false,
                vertical: {
                    mode: 'inline',
                    menuLayout: 'ALayoutSider'
                },
                horizontal: {
                    mode: 'horizontal',
                    menuLayout: 'ALayoutHeader'
                }
            };
        },
        computed: {
            ...mapState('app', {
                menuTheme: state => state.layout.menuTheme,
                isVertical: state => state.layout.isVertical,
                isFixedHeader: state => state.layout.isFixedHeader,
                isFixedSider: state => state.layout.isFixedSider,
                aliveList: state => state.aliveList
            }),
            currentName () {
                return this.$route.name;
            },
            layout () {
                return this.isVertical ? this.vertical : this.horizontal;
            },
            // 垂直布局下侧边菜单伸缩，引起的右侧结构 marginLeft 伸缩变化
            layoutMainLeft () {
                return (this.isVertical && this.isFixedSider) ? (this.collapsed ? 80 : 200) : 0;
            },
            // 垂直布局下固定导航菜单栏，侧边菜单伸缩，引起的右侧头部 marginLeft 伸缩变化
            layoutMainHeaderLeft () {
                return this.isFixedHeader ? this.collapsed ? 80 : 200 : 0;
            }
        },
        created () {
            this.findMainRoutes();
            this.setAliveList();
            this.setMenuList();
        },
        methods: {
            ...mapMutations('app', ['initAliveList']),
            findMainRoutes () {
                const _temp = this.$router.options.routes.find(i => i.path === this.$app.mainPath);
                if (_temp && Array.isArray(_temp.children)) {
                    this.mainRoutes = _temp.children;
                }
            },
            setAliveList () {
                const _temp = [];
                this.depthFilterAlive(this.mainRoutes, _temp);
                this.initAliveList(_temp);
            },
            setMenuList () {
                if (Array.isArray(this.mainRoutes) && this.mainRoutes.length) {
                    this.menuList = this.depthFilterMenu(this.mainRoutes);
                }
            },
            depthFilterMenu (source) {
                return source
                    .filter(item => !(item.meta && item.meta.hideInMenu))
                    .map(item => {
                        let _temp = {};
                        if (item.meta) {
                            _temp.title = item.meta.title || '';
                            _temp.icon = item.meta.icon || '';
                        }
                        _temp.name = item.name;
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
            depthFilterAlive (source, target = []) {
                source
                    .filter(item => !(item.meta && item.meta.notCache))
                    .forEach(item => {
                        target.push(item.name);
                        if (Array.isArray(item.children) && item.children.length) {
                            this.depthFilterAlive(item.children, target);
                        }
                    });
            },
            changeCollapsed () {
                this.collapsed = !this.collapsed;
            },
            showDrawer () {
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

                .trigger {
                    font-size: 20px;
                    line-height: 64px;
                    padding: 0 24px;
                    cursor: pointer;
                }
            }
        }
    }

    .horizontal {
        .layout-header {
            padding: 0 16px;
            transition: all .2s;
            color: #fff;

            .menu {
                display: inline-block;
                line-height: 64px;
            }
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
        color: rgba(0, 0, 0, .65) !important;
    }
</style>
