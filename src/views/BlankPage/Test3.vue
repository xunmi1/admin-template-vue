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
                this.$router.push({name:'Test1111222'});
            }
        }
    };
</script>

<style scoped>

</style>
