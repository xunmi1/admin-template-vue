const toRawType = val =>
  Object.prototype.toString
    .call(val)
    .slice(8, -1)
    .toLowerCase();

/**
 * 通用类型判断
 * @param {*} value 数据
 * @param {string | string[]} [acceptType] 可接受类型
 * @return {boolean|string} 如果 `acceptType` 存在，则返回 `boolean`, 否则返回 `string`
 */
export const typeOf = (value, acceptType) => {
  const result = toRawType(value);
  if (!acceptType) return result;

  if (isString(acceptType)) {
    return result.search(acceptType.toLowerCase()) !== -1;
  }
  if (isArray(acceptType) && acceptType.length) {
    return acceptType.some(v => result.search(v.toLowerCase()) !== -1);
  }
};

/** 是否是引用类型 (Note: 包含数组) */
export const isObject = val => val !== null && typeof val === 'object';

export const isFunction = val => typeof val === 'function';
export const isPromise = val => isObject(val) && isFunction(val.then) && isFunction(val.catch);
export const isArray = Array.isArray;
export const isString = val => typeof val === 'string';
export const isNumber = val => typeof val === 'number';
export const isNaN = val => val !== val;

export const isEmptyObject = val => isObject(val) && !Object.keys(val).length;
