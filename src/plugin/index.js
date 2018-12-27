import Antd from 'ant-design-vue';
import config from '@/config';
import Db from '@/libs/db';
import * as util from '@/libs/util';

import Menu from '@c/Menu/Menu';

const components = {
    VMenu: Menu
};

export default {
    async install (Vue) {
        Vue.use(Antd);
        Vue.prototype.$app = config;
        Vue.prototype.$db = Db.getSingle(config.dbPrefix);
        Object.keys(components).forEach(key => {
            Vue.component(key, components[key]);
        });
        Object.keys(util).forEach(fnKey => {
            Vue.prototype['$_' + fnKey] = util[fnKey];
        });
    }
}
