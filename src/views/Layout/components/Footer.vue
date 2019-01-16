<template>
    <div :class="{'placeholder': isFixed}">
        <footer
            :style="{width: `calc(100% - ${isFixed ?width : 0}px)`}"
            :class="['footer', {'footer-fixed': isFixed}]"
        >
            <ALayoutFooter>
                Copyright © 2018{{ nowYear > 2018 ? ' - ' + nowYear : null }} {{ $app.org }} All Rights Reserved
            </ALayoutFooter>
        </footer>
    </div>
</template>

<script>
    export default {
        name: 'Footer',
        props: {
            isFixed: {
                type: Boolean,
                default: false
            },
            width: {
                type: Number,
                default: 0
            }
        },
        data () {
            return {
                nowYear: new Date().getFullYear()
            };
        }
    };
</script>

<style lang="less" scoped>
    .placeholder::after {
        content: '';
        display: block;
        height: 28px;
    }
    .footer {
        text-align: center;
    }

    .footer-fixed {
        position: fixed;
        line-height: 2;
        bottom: 0;
        padding: 0;
        > div {
            padding: 0;
        }
    }
</style>
