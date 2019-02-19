import Antd from 'ant-design-vue';

import properties from './properties';
import * as methods from './methods';
import components from './components';

// 为对象添加只读属性
const addReadonlyProperty = function (obj, property, value) {
    Object.defineProperty(obj, property, {
        value,
        configurable: false,
        enumerable: true,
        writable: false
    });
};

const addProperties = function (value, obj, ...rest) {
    // 根据 obj、rest 收集已有属性
    const hasProperties = Object.keys(obj).concat(...rest.map(i => Object.keys(i)));
    Object.entries(value).forEach(([key, property]) => {
        if (hasProperties.includes(key)) {
            throw new Error(`property '${ key }' have existed!`);
        }
        addReadonlyProperty(obj, key, property);
    });
};

const addComponents = function (value, obj) {
    Object.entries(value).forEach(([key, component]) => {
        if (obj.component(key)) {
            throw new Error(`component '${ key }' have existed!`);
        }
        obj.component(key, component);
    });
};

export default {
    install: async function (Vue) {
        Vue.use(Antd);

        // 扩展属性
        addProperties(properties, Vue.prototype, new Vue());
        // 扩展业务方法
        addProperties(methods, Vue.prototype, new Vue());
        // 扩展组件
        addComponents(components, Vue);
    }
};
