<template>
    <div>
        test2
        <AInput />
        <AButton type="primary" @click="clearCache">清理‘测试11’缓存</AButton>
    </div>
</template>

<script>
    import { getArticles } from '@/api/news';
    import CancelRequest from '@/libs/common/CancelRequest';

    export default {
        name: 'Test2',
        mounted () {
            const source = new CancelRequest();
            // 模拟取消请求
            getArticles({}, source.token(1))
                .then(res => console.log(res))
                .catch(err => console.log(err));
            source.cancel(1, 'canceled1');

            setTimeout(() => {
                getArticles({}, source.token('articles2'))
                    .then(res => console.log(res))
                    .catch(err => console.log(err));
                source.cancel('articles2', 'canceled2');
            }, 200);
        },
        methods: {
            clearCache () {
                this.$store.commit('app/clearAlive', { page: 'Page11', alive: 'Test1' });
            },
        },
    };
</script>
