<template>
    <AMenu v-bind="$attrs">
        <template v-for="item of menuData">
            <AMenuItem v-if="!item.children" :key="item.name" @click="clickItem">
                <AIcon v-if="item.icon" :type="item.icon" />
                <span>{{ item.title }}</span>
            </AMenuItem>
            <SubMenu v-else :item="item" :key="item.name" @click="clickItem" />
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
            clickItem(item) {
                this.$emit('click', item);
            }
        }
    };
</script>

<style scoped>

</style>
