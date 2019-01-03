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
                this.$store.commit('app/clearAlive', { page: 'Page22',alive: 'Test3' });
            }
        }
    };
</script>

<style scoped>

</style>
