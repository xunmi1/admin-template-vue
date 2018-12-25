<template>
    <div id="app">
        <RouterView />
    </div>
</template>
<script>
    export default {
        name: 'App',
        created() {
            window.document.title = this.$app.title.small;
        }
    };
</script>
<style lang="less">
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
    }
</style>
