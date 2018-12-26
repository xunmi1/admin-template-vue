import Router from 'vue-router';
import Antd from 'ant-design-vue';
import config from '../config';
import Db from '../libs/db';

export default {
    async install (Vue) {
        Vue.use(Router);
        Vue.use(Antd);
        Vue.prototype.$app = config;
        Vue.prototype.$db = Db.getSingle(config.dbPrefix);
    }
}
