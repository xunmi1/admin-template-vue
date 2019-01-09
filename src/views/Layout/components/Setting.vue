<template>
    <div class="setting">
        <ADrawer
            title="界面设置"
            @close="onClose"
            :visible="visible"
            :width="300"
        >
            <div class="setting-option">
                <h3 class="setting-title">导航菜单风格</h3>
                <ATooltip title="暗色">
                    <div @click="toggle('menuTheme', 'dark')" class="setting-layout">
                        <img
                            v-once
                            :src="darkMenuSvg"
                            alt="暗色"
                            width="68"
                            height="58"
                        >
                        <AIcon v-show="menuTheme === 'dark'" type="check" class="check-icon" />
                    </div>
                </ATooltip>
                <ATooltip title="亮色">
                    <div @click="toggle('menuTheme', 'light')" class="setting-layout">
                        <img
                            v-once
                            :src="lightMenuSvg"
                            alt="亮色"
                            width="68"
                            height="58"
                        >
                        <AIcon v-show="menuTheme === 'light'" type="check" class="check-icon" />
                    </div>
                </ATooltip>
            </div>
            <div>
                <h3 class="setting-title">导航菜单布局</h3>
                <ATooltip title="侧边菜单">
                    <div @click="toggle('isVertical', true)" class="setting-layout">
                        <img
                            v-once
                            :src="verticalSvg"
                            alt="侧边菜单"
                            width="68"
                            height="58"
                        >
                        <AIcon v-show="isVertical" type="check" class="check-icon" />
                    </div>
                </ATooltip>
                <ATooltip title="顶部菜单">
                    <div @click="toggle('isVertical', false)" class="setting-layout">
                        <img
                            v-once
                            :src="horizontalSvg"
                            alt="顶部菜单"
                            width="68"
                            height="58"
                        >
                        <AIcon v-show="!isVertical" type="check" class="check-icon" />
                    </div>
                </ATooltip>
            </div>
            <ADivider />
            <div class="setting-option">
                <h3 class="setting-title">主题风格</h3>
                <ul class="setting-theme v-to-zero">
                    <template v-for="item of themeList">
                        <ATooltip :title="item.text" :key="item.name">
                            <li
                                @click="toggle('theme', item.name)"
                                :style="{backgroundColor: item.color}"
                                class="v-to-zero v-pointer v-center"
                            >
                                <AIcon v-show="theme === item.name" type="check" class="check-icon" />
                            </li>
                        </ATooltip>
                    </template>
                </ul>
            </div>
            <ADivider />
            <div class="setting-option">
                <span class="setting-title">固定导航栏</span>
                <ASwitch
                    :checked="isFixedHeader"
                    @change="toggle('isFixedHeader', $event)"
                    class="setting-switch"
                />
            </div>
            <div class="setting-option">
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
            <div class="setting-option">
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
    </div>
</template>

<script>
    import { mapState, mapMutations } from 'vuex';
    import { updateTheme, updateColorWeak } from './theme';

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
                themeList: state => state.themeList,
                theme: state => state.layout.theme
            })
        },
        watch: {
            theme: {
                handler(newVal) {
                    const theme = this.themeList.find(item => item.name === newVal);
                    if (theme || theme.color) {
                        updateTheme(theme.color);
                        updateColorWeak(true);
                    }
                }
            }
        },
        created () {
            this.setLayout(this.$db.get('layout'));
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
                const data = settingItems.reduce((obj, key) => Object.assign(obj, { [key]: this[key] }), {});
                this.$emit('change', false);
                this.$db.set('layout', data);
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
