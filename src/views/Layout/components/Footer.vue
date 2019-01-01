<template>
    <ALayoutFooter
        :style="{width: `calc(100% - ${isFixed ?deleteWidth : 0}px)`}"
        :class="[isFixed ? 'footer-fixed' : 'footer']"
    >
        Copyright © 2018{{ nowYear > 2018 ? ' - ' + nowYear : null }} {{ $app.org }} All Rights Reserved
    </ALayoutFooter>
</template>

<script>
    export default {
        name: 'Footer',
        props: {
            isFixed: {
                type: Boolean,
                default: false
            },
            deleteWidth: {
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

<style scoped>
    .footer {
        text-align: center;
        padding-top: 12px;
    }

    .footer-fixed {
        position: fixed;
        text-align: center;
        line-height: 1.8;
        bottom: 0;
        padding: 0;
    }
</style>
