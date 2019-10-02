import properties from './properties';
import * as methods from './methods';
import components from './components';

// 为对象添加只读属性
const addReadonlyProperty = function (obj, property, value) {
    Object.defineProperty(obj, property, {
        value,
        configurable: false,
        enumerable: true,
        writable: false,
    });
};

const addProperties = function (value, proto) {
    const vm = new proto.constructor();
    const hasProperties = Object.keys(proto).concat(Object.keys(vm));
    Object.entries(value).forEach(([key, property]) => {
        if (hasProperties.includes(key)) {
            throw new Error(`property '${ key }' have existed!`);
        }
        addReadonlyProperty(proto, key, property);
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
    async install (Vue) {
        // 扩展属性
        addProperties(properties, Vue.prototype);
        // 扩展业务方法
        addProperties(methods, Vue.prototype);
        // 扩展组件
        addComponents(components, Vue);
    },
};
