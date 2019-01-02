<template>
    <ACard title="BlankPage">
        <a href="#" slot="extra">more</a>
        BlankPage
        <AInput>
            <AIcon slot="prefix" type="user" />
        </AInput>
        <KeepAlive :include="getAlive($route.matched, 'BlankPage')">
            <!--<KeepAlive :include="alive">-->
            <RouterView />
        </KeepAlive>
    </ACard>
</template>

<script>
    import { mapGetters } from 'vuex';

    export default {
        name: 'BlankPage',
        props: {
            routerName: String
        },
        data () {
            return {
                alive: []
            };
        },
        computed: {
            // alive() {
            //     const aliveList = this.$store.state.app.aliveList;
            //     const matched = this.$route.matched;
            //     const name = 'default';
            //     const index = matched.findIndex(item => item.components[name].name === 'BlankPage');
            //     if (index > -1 && aliveList[matched[index].name]) {
            //         console.log(aliveList[matched[index].name][name]);
            //         return aliveList[matched[index].name][name];
            //     } else {
            //         return [];
            //     }
            // },
            ...mapGetters('app', ['getAlive'])
        }
    };
</script>

<style scoped>

</style>
