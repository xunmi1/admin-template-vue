<template>
  <ABreadcrumb :routes="routes">
    <template #itemRender="{ route }">
      <a v-if="isLast(route)" class="link">{{ route.breadcrumbName }}</a>
      <RouterLink v-else :to="{ name: route.path }">{{ route.breadcrumbName }}</RouterLink>
    </template>
  </ABreadcrumb>
</template>

<script>
import { cache, walkTree, getParentsFromTree } from '@/libs/utils';
import { getVisibleList } from '../utils';

export default {
  name: 'Breadcrumb',
  data() {
    return {
      routes: [],
    };
  },
  watch: {
    '$route.name': {
      handler(name) {
        this.routes = this.getRoutes(name);
      },
      immediate: true,
    },
  },
  beforeCreate() {
    // 菜单列表
    const list = getVisibleList(this.$app.mainName);
    const transfer = v => ({ path: v.key, breadcrumbName: v.title });
    this.menuList = walkTree(transfer, list);
  },
  created() {
    this.getRoutes = cache(this.getRoutes);
  },
  methods: {
    getRoutes(name) {
      const list = getParentsFromTree(v => v.path === name, this.menuList);
      const current = { path: name, breadcrumbName: this.$route.meta.title };
      list.push(current);
      return list;
    },
    isLast(route) {
      return this.routes[this.routes.length - 1] === route;
    },
  },
};
</script>

<style scoped>
.link {
  color: rgba(0, 0, 0, 0.65);
}
</style>
