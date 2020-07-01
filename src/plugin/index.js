import { defineReadonly } from '@/libs/utils';
import properties from './properties';
import * as methods from './methods';
import components from './components';

const addProperties = (value, Ctor) => {
  const vm = new Ctor();
  const proto = Ctor.prototype;

  const properties = Object.keys(proto).concat(Object.keys(vm));
  Object.entries(value).forEach(([key, property]) => {
    if (properties.includes(key)) {
      throw new Error(`property '${key}' had existed!`);
    }
    defineReadonly(proto, key, property);
  });
};

const addComponents = (value, Ctor) => {
  Object.entries(value).forEach(([key, component]) => {
    if (Ctor.component(key)) {
      throw new Error(`component '${key}' had existed!`);
    }
    Ctor.component(key, component);
  });
};

const addDirectives = (value, Ctor) => {
  Object.entries(value).forEach(([key, directive]) => Ctor.directive(key, directive));
};

export default {
  async install(Vue) {
    // 扩展属性
    addProperties(properties, Vue);
    // 扩展业务方法
    addProperties(methods, Vue);
    // 扩展组件
    addComponents(components, Vue);
    addDirectives({}, Vue);
  },
};
