import Antd from 'ant-design-vue';
import config from '@/config';

export default {
    async install (Vue) {
        Vue.use(Antd);
        Vue.prototype.$app = config;
    }
}
