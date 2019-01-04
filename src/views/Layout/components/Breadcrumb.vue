<template>
    <ABreadcrumb :routes="routes" class="breadcrumb">
        <template slot="itemRender" slot-scope="{route, params, routes}">
            <span v-if="routes.indexOf(route) === routes.length - 1">
                {{ route.meta.title }}
            </span>
            <RouterLink v-else :to="{name: route.name}">
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
                    const main = [this.$router.options.routes.find(i => i.name === this.$app.mainName)];
                    this.routes = [];
                    this.findOpenRoute(main);
                    console.log(this.routes);
                },
                immediate: true
            }
        },
        methods: {
            findOpenRoute (menu) {
                return menu.some(item => {
                    this.routes.push(item);
                    if (item.name === this.$route.name) {
                        return true;
                    }
                    if (Array.isArray(item.children) && this.findOpenRoute(item.children)) {
                        return true;
                    }
                    this.routes.pop();
                });
            }
        }
    };
</script>

<style scoped>
    .breadcrumb {
        display: inline-block;
    }
</style>
