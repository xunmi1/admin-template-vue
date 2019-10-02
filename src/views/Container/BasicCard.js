import { mapGetters } from 'vuex';

export default (name, bool = true) => ({
    name,
    render (h) {
        const keepAlive = h('KeepAlive',
            {
                props: { include: this.getAlive(name) },
            },
            [
                h('RouterView')
            ]
        );
        return h('ACard',
            {
                props: {
                    title: this.$route.meta.title,
                    type: 'inner',
                },
            },
            [
                bool ? keepAlive : h('RouterView')
            ]
        );
    },
    computed: {
        ...mapGetters('app', ['getAlive']),
    },
});
