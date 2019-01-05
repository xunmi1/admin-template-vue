import Antd from 'ant-design-vue';
import config from '@/config';
import Db from '@/libs/db';
import * as util from '@/libs/util';

import Menu from '@c/Menu/Menu';

const property = {
    $app: config,
    $db: Db.getSingle(config.dbPrefix)
};

const components = {
    VMenu: Menu
};

export default {
    async install (Vue) {
        Vue.use(Antd);

        const vmProperty = util.unique(Object.keys(Vue.prototype), Object.keys(new Vue()));

        Object.keys(property).forEach(key => {
            if (!vmProperty.includes(key)) {
                Vue.prototype[key] = property[key];
            } else {
                throw `属性 ${ key } 已存在!`;
            }
        });

        Object.keys(util).forEach(fnKey => {
            if (!vmProperty.includes('$_' + fnKey)) {
                Vue.prototype['$_' + fnKey] = util[fnKey];
            } else {
                throw `方法 ${ '$_' + fnKey } 已存在!`;
            }
        });

        Object.keys(components).forEach(key => {
            if (!Vue.component(key)) {
                Vue.component(key, components[key]);
            } else {
                throw `组件 ${ key } 已存在!`;
            }
        });
    }
};
