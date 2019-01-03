import { mapGetters } from 'vuex';

export default function (name, title) {
    return {
        name,
        render (h) {
            return h(
                'ACard',
                {
                    props: { title }
                },
                [
                    h(
                        'KeepAlive',
                        {
                            props: { include: this.getAlive(name) }
                        },
                        [
                            h('RouterView')
                        ]
                    )
                ]
            );
        },
        computed: {
            ...mapGetters('app', ['getAlive'])
        }
    };
}
