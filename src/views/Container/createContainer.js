import { mapGetters } from 'vuex';

/**
 * 空白容器组件，用于含有子路由的路由页面
 * @param {string} name 组件名
 * @param {boolean} [bool=true] 是否缓存，默认开启缓存
 * @return {Object}
 */
export default (name, bool = true) => ({
    name,
    render (h) {
        const viewVNode = h('RouterView');
        if (!bool) return viewVNode;
        const include = this.getAlive(name);
        return h('KeepAlive', { props: { include } }, [viewVNode]);
    },
    computed: {
        ...mapGetters('app', ['getAlive']),
    },
});
