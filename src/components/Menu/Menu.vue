<template>
    <AMenu v-bind="$attrs">
        <template v-for="item in menuData">
            <AMenuItem v-if="!item.children" :key="item.name" @click="pushRouter">
                <AIcon v-if="item.icon" :type="item.icon" />
                <span>{{ item.title }}</span>
            </AMenuItem>
            <SubMenu v-else :item="item" :key="item.name" @click="pushRouter" />
        </template>
    </AMenu>
</template>

<script>
    import SubMenu from './SubMenu';

    export default {
        name: 'VMenu',
        components: { SubMenu },
        props: {
            menuData: {
                type: Array,
                required: true
            }
        },
        data () {
            return {
                list: []
            };
        },
        methods: {
            pushRouter(item) {
                this.$router.push({name : item.key})
            }
        }
    };
</script>

<style scoped>

</style>
