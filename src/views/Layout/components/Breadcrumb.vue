<template>
    <ABreadcrumb :routes="routes">
        <template #itemRender="{route}">
            <a v-if="routes.indexOf(route) === routes.length - 1" style="color: rgba(0, 0, 0, .65)">
                {{ route.meta.title }}
            </a>
            <RouterLink v-else :to="route">
                {{ route.meta.title }}
            </RouterLink>
        </template>
    </ABreadcrumb>
</template>

<script>
    export default {
        name: 'Breadcrumb',
        data () {
            return {
                routes: []
            };
        },
        watch: {
            '$route.name': {
                handler () {
                    this.routes = [];
                    this.findOpenRoute(this.$router.options.routes);
                },
                immediate: true
            }
        },
        methods: {
            findOpenRoute (menu) {
                return menu.some(item => {
                    this.routes.push({ ...item, path: item.name });
                    if (item.name === this.$route.name) {
                        return true;
                    }
                    if (Array.isArray(item.children) && this.findOpenRoute(item.children)) {
                        return true;
                    }
                    this.routes.pop();
                    return false;
                });
            }
        }
    };
</script>
