<template>
    <div class="setting">
        <ADrawer
            title="界面设置"
            @close="onClose"
            :visible="visible"
            :width="280"
        >
            <div class="setting-option">
                <h3 class="setting-title">导航菜单风格</h3>
                <ATooltip title="暗色">
                    <div @click="changeMenuTheme('dark')" class="setting-layout">
                        <img :src="darkMenuSvg" alt="暗色" width="68">
                        <AIcon v-show="menuTheme === 'dark'" type="check" class="check-icon" />
                    </div>
                </ATooltip>
                <ATooltip title="亮色">
                    <div @click="changeMenuTheme('light')" class="setting-layout">
                        <img :src="lightMenuSvg" alt="亮色" width="68">
                        <AIcon v-show="menuTheme === 'light'" type="check" class="check-icon" />
                    </div>
                </ATooltip>
            </div>
            <div>
                <h3 class="setting-title">导航菜单布局</h3>
                <ATooltip title="侧边菜单">
                    <div @click="changeVertical(true)" class="setting-layout">
                        <img :src="verticalSvg" alt="侧边菜单" width="68">
                        <AIcon v-show="isVertical" type="check" class="check-icon" />
                    </div>
                </ATooltip>
                <ATooltip title="顶部菜单">
                    <div @click="changeVertical(false)" class="setting-layout">
                        <img :src="horizontalSvg" alt="顶部菜单" width="68">
                        <AIcon v-show="!isVertical" type="check" class="check-icon" />
                    </div>
                </ATooltip>
            </div>
            <ADivider />
            <div class="setting-option">
                <span class="setting-title">固定导航栏</span>
                <ASwitch :checked="isFixedHeader" @change="changeFixedHeader" class="setting-switch" />
            </div>
            <div class="setting-option">
                <ATooltip :title="!isVertical ? '侧边菜单时可配置' : null" placement="left">
                    <span class="setting-title">固定左侧菜单</span>
                    <ASwitch
                        :checked="isFixedSider"
                        :disabled="!isVertical"
                        @change="changeFixedSider"
                        class="setting-switch"
                    />
                </ATooltip>
            </div>
            <div class="setting-option">
                <ATooltip :title="isVertical ? '顶部菜单时可配置' : null" placement="left">
                    <span class="setting-title">水平菜单靠右</span>
                    <ASwitch
                        :checked="isMenuRight"
                        :disabled="isVertical"
                        @change="changeMenuRight"
                        class="setting-switch"
                    />
                </ATooltip>
            </div>
        </ADrawer>
    </div>
</template>

<script>
    import { mapState, mapMutations } from 'vuex';

    export default {
        name: 'Setting',
        model: {
            prop: 'visible',
            event: 'change'
        },
        props: {
            visible: Boolean
        },
        data () {
            return {
                lightMenuSvg: require('@/assets/svg/lightMenu.svg'),
                darkMenuSvg: require('@/assets/svg/darkMenu.svg'),
                verticalSvg: require('@/assets/svg/vertical.svg'),
                horizontalSvg: require('@/assets/svg/horizontal.svg')
            };
        },
        computed: {
            ...mapState('app', {
                menuTheme: state => state.layout.menuTheme,
                isVertical: state => state.layout.isVertical,
                isFixedHeader: state => state.layout.isFixedHeader,
                isFixedSider: state => state.layout.isFixedSider,
                isMenuRight: state => state.layout.isMenuRight,
            })
        },
        created () {
            this.setLayout(this.$db.get('layout'));
        },
        methods: {
            ...mapMutations('app', ['setLayout']),
            changeMenuTheme (theme) {
                if (theme !== this.menuTheme) {
                    this.setLayout({ menuTheme: theme });
                }
            },
            changeVertical (bool) {
                if (bool !== this.isVertical) {
                    this.setLayout({ isVertical: bool });
                }
            },
            changeFixedHeader (bool) {
                this.setLayout({ isFixedHeader: bool });
            },
            changeFixedSider (bool) {
                this.setLayout({ isFixedSider: bool });
            },
            changeMenuRight (bool) {
                this.setLayout({ isMenuRight: bool });
            },
            onClose () {
                const data = {};
                ['menuTheme', 'isVertical', 'isFixedHeader', 'isFixedSider', 'isMenuRight'].forEach(key => data[key] = this[key]);
                this.$db.set('layout', data);
                this.$emit('change', false);
            }
        }
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

        &-layout {
            position: relative;
            display: inline-block;
            margin-right: 18px;
            cursor: pointer;

            .check-icon {
                position: absolute;
                left: 38px;
                bottom: 12px;
                font-size: 18px;
                color: #1890ff;
            }
        }

        &-option {
            margin-bottom: 24px;
        }

        &-switch {
            float: right;
        }
    }
</style>
