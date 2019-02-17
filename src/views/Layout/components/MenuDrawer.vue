<template>
    <ADrawer
        :visible="!collapsed"
        placement="left"
        :closable="false"
        :width="width"
        :wrap-class-name="`menu-drawer menu-drawer-${theme}`"
        mask-closable
        @close="onClose"
    >
        <slot />
    </ADrawer>
</template>

<script>
    export default {
        name: 'MenuDrawer',
        model: {
            prop: 'collapsed',
            event: 'change'
        },
        props: {
            collapsed: Boolean,
            theme: {
                type: String,
                validator: value => ['dark', 'light'].includes(value),
                default: 'light'
            },
            width: {
                type: Number,
                default: 200
            }
        },
        deactivated() {
            console.log(1111);
            this.onClose();
        },
        methods: {
            onClose() {
                this.$emit('change', true);
            }
        }
    };
</script>

<style lang="less">
    .menu-drawer {
        .ant-drawer-body {
            padding: 0;
        }
        &-dark {
            .ant-drawer-content {
                background-color: #001529;
            }
        }
    }
</style>
