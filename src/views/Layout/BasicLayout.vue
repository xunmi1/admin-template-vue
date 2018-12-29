<template>
    <div>
        <ALayout :class="isVertical ? 'vertical' : 'horizontal'">
            <compontent
                :is="layout.menuLayout"
                v-model="collapsed"
                collapsible
                breakpoint="xl"
                :class="{'header-fixed': isFixedHeader}"
                class="layout-sider layout-header"
            >
                <VMenu
                    :menu-data="menuList"
                    :default-selected-keys="[currentName]"
                    :mode="layout.mode"
                    theme="dark"
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
                    <RouterView />
                </ALayoutContent>
            </ALayout>
        </ALayout>
        <Setting v-model="showSetting" />
    </div>
</template>

<script>
    import { mapState } from 'vuex';
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
                menuList: [],
                collapsed: false,
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
                isVertical: state => state.layout.isVertical,
                isFixedHeader: state => state.layout.isFixedHeader
            }),
            currentName () {
                return this.$route.name;
            },
            layout () {
                return this.isVertical ? this.vertical : this.horizontal;
            },
            layoutMainLeft () {
                return this.isVertical ? this.collapsed ? 80 : 200 : 0;
            },
            layoutMainHeaderLeft () {
                return this.isFixedHeader ? this.layoutMainLeft : 0;
            }
        },
        created () {
            this.setMenuList();
        },
        methods: {
            setMenuList () {
                const routes = this.$router.options.routes.find(i => i.path === this.$app.mainPath);
                if (Array.isArray(routes.children) && routes.children.length) {
                    this.menuList = this.depthFilter(routes.children);
                }
            },
            depthFilter (source) {
                return source
                    .filter(item => !(item.meta && item.meta.hideInMenu))
                    .map(item => {
                        const _temp = {};
                        if (item.meta) {
                            _temp.title = item.meta.title || '';
                            _temp.icon = item.meta.icon || '';
                        }
                        _temp.name = item.name;
                        if (Array.isArray(item.children) && item.children) {
                            _temp.children = this.depthFilter(item.children);
                        }
                        return _temp;
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
    .vertical {
        .layout-sider {
            position: fixed;
            left: 0;
            height: 100vh;
            overflow: auto;
            z-index: 2;
        }

        .layout-main {
            &-header {
                background-color: #fff;
                padding: 0;
                transition: all .2s;
                box-shadow: 0 1px 4px rgba(0, 21, 41, .12);
                .trigger {
                    font-size: 20px;
                    line-height: 64px;
                    padding: 0 24px;
                    cursor: pointer;
                }
            }

            &-content {
                margin: 16px 16px 0;
                overflow: initial;
            }
        }
    }

    .horizontal {
        .layout-header {
            padding: 0 16px;
            transition: all .2s;
            color: #fff;
            box-shadow: 0 1px 4px rgba(0, 21, 41, .12);
            .menu {
                display: inline-block;
                line-height: 64px;
            }
        }

        .layout-main {
            &-content {
                margin: 16px 16px 0;
                overflow: initial;
            }
        }
    }

    .header-fixed {
        position: fixed;
        top: 0;
        right: 0;
        width: 100%;
        z-index: 1;
    }

    .content-fixed-top {
        padding-top: 64px;
    }

    .header-tool {
        float: right;
        overflow: hidden;
    }
</style>
