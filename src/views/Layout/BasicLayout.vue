<template>
    <ALayout>
        <ALayoutHeader>
            <VMenu
                :menu-data="menuList"
                :default-selected-keys="[currentName]"
                mode="horizontal"
                theme="dark"
                :style="{ lineHeight: '64px' }"
            />
        </ALayoutHeader>
        <ALayoutContent>
            <RouterView />
        </ALayoutContent>
    </ALayout>
</template>

<script>
    export default {
        name: 'BasicLayout',
        data () {
            return {
                menuList:[]
            };
        },
        computed: {
            currentName () {
                return this.$route.name;
            }
        },
        created () {
            this.setList();
        },
        methods: {
            setList() {
                const routes = this.$router.options.routes.find(i => i.path === this.$app.mainPath);
                if (Array.isArray(routes.children) && routes.children.length) {
                    this.menuList = this.depthFilter(routes.children);
                }
            },
            depthFilter (source) {
                return source
                    .filter(item => !(item.meta && item.meta.hideInMenu))
                    .map(item => {
                        const _temp = {};
                        if (item.meta) {
                            _temp.title = item.meta.title || '';
                            _temp.icon = item.meta.icon || '';
                        }
                        _temp.name = item.name;
                        if (Array.isArray(item.children) && item.children) {
                            _temp.children = this.depthFilter(item.children);
                        }
                        return _temp;
                    });
            }
        }
    };
</script>

<style scoped>

</style>
