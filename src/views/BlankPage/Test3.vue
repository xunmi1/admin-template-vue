<template>
    <div>
        test3
        <AInput />
        <AButton type="primary" @click="clearCache">清理组件缓存（自己）</AButton>
    </div>
</template>

<script>
    export default {
        name: 'Test3',
        methods: {
            clearCache() {
                this.$store.commit('app/clearAlive', { page: 'Page11',alive: 'Test1' });
            }
        }
    };
</script>

<style scoped>

</style>
