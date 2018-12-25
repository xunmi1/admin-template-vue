import config from '@/config';

export default {
    async install (Vue) {
        Vue.prototype.$app = config;
    }
}
