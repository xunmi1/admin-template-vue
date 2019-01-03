import { mapGetters } from 'vuex';

export default function (name, title) {
    return {
        name,
        render (h) {
            return h(
                'ACard',
                {
                    props: {
                        title
                    }
                },
                [
                    h(
                        'KeepAlive',
                        {
                            props: {
                                include: this.alive
                            }
                        },
                        [
                            h('RouterView')
                        ]
                    )
                ]
            );
        },
        data () {
            return {
                alive: [],
            }
        },
        computed: {
            ...mapGetters('app', ['getAlive']),
        },
        beforeRouteUpdate (to, from, next) {
            this.alive = this.getAlive(name);
            next();
        },
    };
}
