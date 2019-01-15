import { mapGetters } from 'vuex';

export default function (name, bool) {
    return {
        name,
        render (h) {
            const keepAlive = h('KeepAlive',
                {
                    props: { include: this.alive }
                },
                [
                    h('RouterView')
                ]
            );
            return h('ACard',
                {
                    props: {
                        title: this.$route.meta.title
                    }
                },
                [
                    bool ? keepAlive : h('RouterView')
                ]
            );
        },
        computed: {
            ...mapGetters('app', ['getAlive'])
        }
    };
}
