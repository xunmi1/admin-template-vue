<template>
    <ADrawer
        :visible="visible"
        :width="286"
        @close="onClose"
        class="setting"
        title="界面设置"
    >
        <div class="setting-option-mb">
            <h4 class="setting-title">导航菜单风格</h4>
            <ATooltip title="暗色">
                <div @click="toggle('menuTheme', 'dark')" class="setting-layout">
                    <DarkMenuSvg class="setting-svg" v-once />
                    <AIcon class="check-icon v-theme-color" type="check" v-show="menuTheme === 'dark'" />
                </div>
            </ATooltip>
            <ATooltip title="亮色">
                <div @click="toggle('menuTheme', 'light')" class="setting-layout">
                    <LightMenuSvg class="setting-svg" v-once />
                    <AIcon class="check-icon v-theme-color" type="check" v-show="menuTheme === 'light'" />
                </div>
            </ATooltip>
        </div>
        <div>
            <h4 class="setting-title">导航菜单布局</h4>
            <ATooltip title="侧边菜单">
                <div @click="toggle('isVertical', true)" class="setting-layout">
                    <VerticalSvg class="setting-svg" v-once />
                    <AIcon class="check-icon v-theme-color" type="check" v-show="isVertical" />
                </div>
            </ATooltip>
            <ATooltip title="顶部菜单">
                <div
                    @click="isMobileDevice ? null : toggle('isVertical', false)"
                    :class="{'setting-layout': true, 'v-disabled': isMobileDevice}"
                >
                    <HorizontalSvg class="setting-svg" v-once />
                    <AIcon class="check-icon v-theme-color" type="check" v-show="!isVertical" />
                </div>
            </ATooltip>
            <ADivider />
        </div>
        <div class="setting-option-mb" v-if="!!themeList">
            <h4 class="setting-title">主题风格</h4>
            <ul class="setting-theme v-to-zero">
                <template v-for="item of themeList">
                    <ATooltip :key="item.name" :title="item.text">
                        <li
                            :style="{backgroundColor: item.variables['@primary-color']}"
                            @click="toggle('theme', item.name)"
                            class="v-to-zero v-pointer v-center"
                        >
                            <AIcon class="check-icon" type="check" v-show="theme === item.name" />
                        </li>
                    </ATooltip>
                </template>
            </ul>
            <ADivider />
        </div>
        <div class="setting-option-mb">
            <span class="setting-title">固定导航栏</span>
            <ASwitch
                :checked="isFixedHeader"
                @change="toggle('isFixedHeader', $event)"
                class="setting-switch"
            />
        </div>
        <div class="setting-option-mb">
            <ATooltip :title="!isVertical ? '侧边菜单时可配置' : null" placement="left">
                <span class="setting-title">固定左侧菜单</span>
                <ASwitch
                    :checked="isFixedSider"
                    :disabled="!isVertical"
                    @change="toggle('isFixedSider', $event)"
                    class="setting-switch"
                />
            </ATooltip>
        </div>
        <div>
            <ATooltip :title="isVertical ? '顶部菜单时可配置' : null" placement="left">
                <span class="setting-title">水平菜单靠右</span>
                <ASwitch
                    :checked="isMenuRight"
                    :disabled="isVertical"
                    @change="toggle('isMenuRight', $event)"
                    class="setting-switch"
                />
            </ATooltip>
        </div>
    </ADrawer>
</template>

<script>
    import { mapState, mapGetters, mapMutations } from 'vuex';
    import LightMenuSvg from '@/assets/svg/lightMenu.svg?inline';
    import DarkMenuSvg from '@/assets/svg/darkMenu.svg?inline';
    import VerticalSvg from '@/assets/svg/vertical.svg?inline';
    import HorizontalSvg from '@/assets/svg/horizontal.svg?inline';
    import { themeListMixin } from '../mixins/themeMixin';

    export default {
        name: 'Setting',
        components: {
            LightMenuSvg,
            DarkMenuSvg,
            VerticalSvg,
            HorizontalSvg
        },
        model: {
            prop: 'visible',
            event: 'change'
        },
        props: {
            visible: Boolean
        },
        computed: {
            ...mapState('app', {
                menuTheme: state => state.layout.menuTheme,
                isVertical: state => state.layout.isVertical,
                isFixedHeader: state => state.layout.isFixedHeader,
                isFixedSider: state => state.layout.isFixedSider,
                isMenuRight: state => state.layout.isMenuRight,
                theme: state => state.layout.theme
            }),
            ...mapGetters('app', ['isMobileDevice'])
        },
        created () {
            this.setThemeList();
        },
        methods: {
            ...mapMutations('app', ['setLayout']),
            toggle (type, value) {
                if (this[type] !== undefined && this[type] !== value) {
                    this.setLayout({ [type]: value });
                }
            },
            onClose () {
                const settingItems = ['menuTheme', 'isVertical', 'isFixedHeader', 'isFixedSider', 'isMenuRight', 'theme'];
                const data = settingItems.reduce((obj, key) => ({ ...obj, [key]: this[key] }), {});
                this.$emit('change', false);
                this.$db.set('layout', data);
            },
            setThemeList () {
                try {
                    this.themeList = themeListMixin;
                } catch (e) {
                    this.themeList = false;
                }
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
