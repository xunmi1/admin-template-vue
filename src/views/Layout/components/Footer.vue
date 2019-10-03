<template functional>
    <div :class="{ 'placeholder': props.isFixed }">
        <footer
            :class="['footer', { 'footer-fixed': props.isFixed }]"
            :style="{ width: `calc(100% - ${props.isFixed ? props.width : 0}px)` }"
        >
            <ALayoutFooter>
                <span>Copyright © {{ props.startYear }}</span>
                <span>{{ props.currentYear > props.startYear ? ' - ' + props.currentYear : null }} </span>
                <span>{{ parent.$app.org }} All Rights Reserved.</span>
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
                default: false,
            },
            width: {
                type: Number,
                default: 0,
            },
            startYear: {
                type: Number,
                default: 2018,
            },
            currentYear: {
                type: Number,
                default: new Date().getFullYear(),
            },
        },
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
