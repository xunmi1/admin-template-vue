<template>
    <div>
        test2
        <AInput />
        <AButton type="primary" @click="clearCache">清理‘测试11’缓存</AButton>
    </div>
</template>

<script>
    import { articles } from '@/api/news';
    import CancelRequest from '@/libs/common/cancelRequest';

    export default {
        name: 'Test2',
        mounted () {
            const source = new CancelRequest();

            articles({}, source.token(1))
                .then(res => console.log(res))
                .catch(err => console.log(err));
            source.cancel(1, 'canceled1');

            setTimeout(() => {
                articles({}, source.token('articles2'))
                    .then(res => console.log(res))
                    .catch(err => console.log(err));
                source.cancel('articles2', 'canceled2');
            }, 200);
        },
        methods: {
            clearCache () {
                this.$store.commit('app/clearAlive', { page: 'Page11', alive: 'Test1' });
            }
        }
    };
</script>

<style scoped>

</style>
