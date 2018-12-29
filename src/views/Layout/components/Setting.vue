<template>
    <div class="setting">
        <ADrawer
            title="界面设置"
            @close="onClose"
            :visible="visible"
            :width="280"
        >
            <h3 class="setting-title">导航菜单布局</h3>
            <ATooltip title="侧边菜单布局">
                <div @click="changeVertical(true)" class="setting-layout">
                    <img :src="verticalSvg" alt="侧边菜单布局" width="68">
                    <AIcon v-show="isVertical" type="check" class="check-icon" />
                </div>
            </ATooltip>
            <ATooltip title="侧边菜单布局">
                <div @click="changeVertical(false)" class="setting-layout">
                    <img :src="horizontalSvg" alt="顶部菜单布局" width="68">
                    <AIcon v-show="!isVertical" type="check" class="check-icon" />
                </div>
            </ATooltip>
            <ADivider />
            <div>
                <span class="setting-title">导航栏是否固定</span>
                <ASwitch :checked="isFixedHeader" @change="changeFixedHeader" class="setting-switch" />
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
                verticalSvg: require('@/assets/svg/vertical.svg'),
                horizontalSvg: require('@/assets/svg/horizontal.svg')
            };
        },
        computed: {
            ...mapState('app', {
                isVertical: state => state.layout.isVertical,
                isFixedHeader: state => state.layout.isFixedHeader
            })
        },
        methods: {
            ...mapMutations('app', ['setLayout']),
            changeVertical (bool) {
                if (bool !== this.isVertical) {
                    this.setLayout({ isVertical: bool });
                }
            },
            changeFixedHeader (bool) {
                this.setLayout({ isFixedHeader: bool });
            },
            onClose () {
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
        &-switch {
            float: right;
        }
    }
</style>
