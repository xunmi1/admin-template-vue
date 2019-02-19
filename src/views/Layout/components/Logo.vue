<template>
    <div :class="[isVertical ? 'vertical' : 'horizontal', theme]">
        <img
            v-once
            :src="publicPath + $app.logoPath"
            v-if="$app.logoPath"
            alt="图标"
            height="36"
            width="36"
            class="logo"
        >
        <h1 v-show="title">{{ title }}</h1>
    </div>
</template>

<script>
    import { mapState } from 'vuex';

    export default {
        name: 'Logo',
        props: {
            collapsed: Boolean,
            theme: {
                type: String,
                validator: value => ['dark', 'light'].includes(value)
            }
        },
        data () {
            return {
                title: this.$app.title.small,
                publicPath: process.env.BASE_URL
            };
        },
        computed: mapState('app', {
            isVertical: state => state.layout.isVertical
        }),
        watch: {
            collapsed (newVal) {
                if (this.isVertical && newVal) {
                    this.title = null;
                } else {
                    setTimeout(() => this.title = this.$app.title.small, 168);
                }
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
