<template>
    <div>
        test2
        <AInput />
        <AButton type="primary" @click="clearCache">清理‘测试11’缓存</AButton>
    </div>
</template>

<script>
    export default {
        name: 'Test2',
        methods: {
            clearCache() {
                console.log(this);
                this.$store.commit('app/clearAlive', { page: 'Page11',alive: 'Test1' });
            }
        }
    };
</script>

<style scoped>

</style>
