<template>
  <div>
    test2
    <AInput />
    <AButton type="primary" @click="clearCache">清理‘测试11’缓存</AButton>
  </div>
</template>

<script>
import { getArticles } from '@/api/news';
import { AbortRequest } from '@/libs/http';

const abortController = new AbortRequest();

export default {
  name: 'Test2',
  mounted() {
    // 模拟取消请求
    const signal = 'articles';
    const token = abortController.create(signal);
    getArticles({}, token);
    abortController.abort(signal, 'has aborted');
  },
  methods: {
    clearCache() {
      this.$store.commit('app/clearAlive', { page: 'Page11', alive: 'Test1' });
    },
  },
};
</script>
