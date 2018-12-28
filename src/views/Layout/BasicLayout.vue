<template>
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
            </ALayoutHeader>
            <ALayoutContent :class="{'content-fixed-top': isFixedHeader}" class="layout-main-content">
                <ASwitch v-model="isVertical" />
                <RouterView />
            </ALayoutContent>
        </ALayout>
    </ALayout>
</template>

<script>
    import { horizontal, vertical } from './setting';

    export default {
        name: 'BasicLayout',
        data () {
            return {
                menuList: [],
                isVertical: false,
                collapsed: false,
                isFixedHeader: true,
                layout: {}
            };
        },
        computed: {
            currentName () {
                return this.$route.name;
            },
            layoutMainLeft () {
                return this.isVertical ? this.collapsed ? 80 : 200 : 0;
            },
            layoutMainHeaderLeft () {
                return this.isFixedHeader ? this.layoutMainLeft : 0;
            }
        },
        watch: {
            isVertical: {
                handler (newValue) {
                    this.layout = newValue ? vertical : horizontal;
                },
                immediate: true
            }
        },
        created () {
            this.setList();
        },
        methods: {
            setList () {
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
            transition: all .2s;

            .menu {
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
</style>
