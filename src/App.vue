<template>
    <div id="app">
        <RouterView />
    </div>
</template>
<script>
    export default {
        name: 'App',
        created () {
            window.document.title = this.$app.title.small;
        }
    };
</script>
<style lang="less">
    @import "~ant-design-vue/dist/antd.less";
    @import "./assets/style/antd-theme.less";
    @import "./assets/style/public.less";
</style>
