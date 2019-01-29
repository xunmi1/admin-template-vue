import Antd from 'ant-design-vue';
import config from '@/config';
import Db from '@/libs/db';
import * as util from '@/libs/util';

import { wrappedEditor } from './highOrderComponent';
import VMenu from '@c/Menu/Menu';
import Tinymce from '@c/Tinymce/Tinymce';

const properties = {
    app: config,
    db: Db.getSingle(config.dbPrefix)
};

const components = {
    VMenu,
    VRichEditor: wrappedEditor(Tinymce)
};

const addReadonlyProperty = function (obj, property, value) {
    Object.defineProperty(obj, property, { value, enumerable: true });
};

export default {
    install: async function (Vue) {
        Vue.use(Antd);

        const vmProperty = util.unique(Object.keys(Vue.prototype), Object.keys(new Vue()));

        // 扩展属性
        Object.keys(properties).forEach(key => {
            const __key = '$' + key;
            if (vmProperty.includes(__key)) {
                throw new Error(`属性 ${ __key } 已存在!`);
            }
            addReadonlyProperty(Vue.prototype, __key, properties[key]);
        });

        // 扩展方法
        Object.keys(util).forEach(fnKey => {
            const __key = '$_' + fnKey;
            if (vmProperty.includes(__key)) {
                throw new Error(`方法 ${ __key } 已存在!`);
            }
            addReadonlyProperty(Vue.prototype, __key, util[fnKey]);
        });

        // 扩展组件
        Object.keys(components).forEach(key => {
            if (Vue.component(key)) {
                throw new Error(`组件 ${ key } 已存在!`);
            }
            Vue.component(key, components[key]);
        });
    }
};
