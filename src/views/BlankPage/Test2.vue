<template>
    <div>
        test2
        <AInput />
    </div>
</template>

<script>
    export default {
        name: 'Test2',
        mounted() {
            this.$store.commit('app/clearAlive', { page: 'test1',alive: 'Test1' });
        }
    };
</script>

<style scoped>

</style>
