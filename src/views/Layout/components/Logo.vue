<template>
    <div :class="[isVertical ? 'vertical' : 'horizontal', theme]">
        <img
            v-once
            v-if="logo"
            :src="logo"
            alt="图标"
            height="36"
            class="logo"
        >
        <h1 v-show="showTitle">{{ title }}</h1>
    </div>
</template>

<script>
    import { mapState } from 'vuex';

    export default {
        name: 'Logo',
        props: {
            collapsed: Boolean,
            theme: {
                validator: (value) => ['dark', 'light'].includes(value)
            }
        },
        data () {
            return {
                logo: null,
                title: this.$app.title.small
            };
        },
        computed: {
            ...mapState('app', {
                isVertical: state => state.layout.isVertical
            }),
            showTitle() {
                return !(this.isVertical && this.collapsed);
            }
        },
        created () {
            try {
                this.logo = require('@/assets/svg/fire.svg');
            } catch (e) {
                this.logo = null;
            }
        }
    };
</script>

<style lang="less" scoped>
    .horizontal {
        display: inline-block;
        float: left;
        max-height: 64px;
        transition: all .2s;
        h1 {
            display: inline-block;
            font-size: 20px;
            margin: 0 12px;
            color: #fff;
        }
    }

    .vertical {
        text-align: center;
        min-height: 64px;
        padding-top: 13px;
        transition: all .2s;
        h1 {
            vertical-align: text-bottom;
            display: inline-block;
            font-size: 20px;
            margin: 0 8px;
            color: #fff;
        }
    }

    .dark {
        h1 {
            color: #fff;
        }
    }

    .light {
        h1 {
            color: #002140;
        }
    }

    .light.vertical {
        border-bottom: 1px solid #e8e8e8;
        border-right: 1px solid #e8e8e8;
    }

    .dark.vertical {
        background-color: #002140;
    }

    .logo {
        margin-bottom: 12px;
    }
</style>
