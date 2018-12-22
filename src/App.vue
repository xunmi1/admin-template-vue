<template>
    <div id="app">
        <div id="nav">
            <RouterLink to="/">Home</RouterLink>
            |
            <RouterLink to="/about">About</RouterLink>
            |
            <RouterLink to="/login">login</RouterLink>
        </div>
        <RouterView />
    </div>
</template>
<script>
    export default {
        name: 'App'
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

    #nav {
        padding: 30px;

        a {
            font-weight: bold;
            color: #2c3e50;

            &.router-link-exact-active {
                color: #42b983;
            }
        }
    }
</style>
