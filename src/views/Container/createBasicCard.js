import { mapGetters } from 'vuex';

export default (name, bool = true) => ({
  name,
  render(h) {
    const viewVNode = h('RouterView');
    const keepAlive = h('KeepAlive', { props: { include: this.getAlive(name) } }, [viewVNode]);
    return h('ACard', { props: { title: this.$route.meta.title } }, [bool ? keepAlive : viewVNode]);
  },
  computed: {
    ...mapGetters('app', ['getAlive']),
  },
});
