import Antd from 'ant-design-vue';
import config from '@/config';
import Db from '@/libs/db';
import * as util from '@/libs/util';

import { wrappedEditor } from './highOrderComponent';
import VMenu from '@c/Menu/Menu';
import Tinymce from '@c/Tinymce/Tinymce';

const property = {
    app: config,
    db: Db.getSingle(config.dbPrefix)
};

const components = {
    VMenu,
    VRichEditor: wrappedEditor(Tinymce)
};

export default {
    install: async function (Vue) {
        Vue.use(Antd);

        const vmProperty = util.unique(Object.keys(Vue.prototype), Object.keys(new Vue()));

        Object.keys(property).forEach(key => {
            if (vmProperty.includes('$' + key)) {
                throw new Error(`属性 ${ '$' + key } 已存在!`);
            }
            Vue.prototype['$' + key] = property[key];
        });

        Object.keys(util).forEach(fnKey => {
            if (vmProperty.includes('$_' + fnKey)) {
                throw new Error(`方法 ${ '$_' + fnKey } 已存在!`);
            }
            Vue.prototype['$_' + fnKey] = util[fnKey];
        });

        Object.keys(components).forEach(key => {
            if (Vue.component(key)) {
                throw new Error(`组件 ${ key } 已存在!`);
            }
            Vue.component(key, components[key]);
        });
    }
};
