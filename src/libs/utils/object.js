import { isObject } from './type';

export const defineProperty = Object.defineProperty;

export const defineGet = (target, key, fn) => {
  defineProperty(target, key, {
    configurable: true,
    enumerable: false,
    get: fn,
  });
};

const hasOwnProperty = Object.prototype.hasOwnProperty;

export const hasOwn = (obj, key) => hasOwnProperty.call(obj, key);

/**
 * 对象深度冻结，会修改原数据，注: 不支持 Map | Set 等类似数据类型
 * @param {Object} obj 需要冻结的数据
 * @returns {Object} 冻结后的数据
 */
export function deepFreeze(obj) {
  if (isObject(obj) && !Object.isFrozen(obj)) {
    Object.freeze(obj);
    Object.keys(obj).forEach(property => deepFreeze(obj[property]));
  }
  return obj;
}
