export const isNative = function (value) {
  if (typeof value !== 'string') return false;
  return /^[a-z]/.test(value);
};

// 合并对象，优先 source
export const deepMerge = function (target, source = {}) {
  let isDeep = false;
  Object.entries(target).forEach(([key, value]) => {
    if (typeof value === 'object') {
      source[key] = deepMerge(value, source[key]);
      isDeep = true;
    }
  });
  if (!isDeep) {
    const initValue = Array.isArray(source) ? [] : {};
    source = Object.assign(initValue, target, source);
  }
  return source;
};

export const equal = (newVal, oldVal) => {
  if (newVal === oldVal) return true;
  const [_newVal, _oldVal] = [newVal, oldVal].map(value => JSON.stringify(value));
  return _newVal === _oldVal;
};

// 表单验证 `Promise` 化
export const createValidateAsync = validate => (fieldNames, options) =>
  new Promise((resolve, reject) => {
    const callback = (errors, values) => (errors ? reject(errors) : resolve(values));
    if (!Array.isArray(fieldNames)) validate(callback);
    else if (!options) validate(fieldNames, callback);
    else validate(fieldNames, options, callback);
  });

// 将空字符串的值重置为 undefined
export const resetEmptyStr = function ({ ...values }) {
  Object.keys(values).forEach(key => {
    if (values[key] === '') values[key] = undefined;
  });
  return values;
};
