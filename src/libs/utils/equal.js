import { isString, isObject, typeOf, isNaN } from './type';

const isNativeDate = val => val instanceof Date;
const isMapOrSet = val => typeOf(val, ['Set', 'Map']);

const getSize = val => (isString(val) ? val.length : isMapOrSet(val) ? val.size : Object.keys(val).length);
const convert = val => (isNativeDate(val) ? val.getTime() : isMapOrSet(val) ? [...val] : val);

const equalFn = (transfer, list) => list.map(v => transfer(v)).every((_, i, arr) => (i ? arr[i - 1] === arr[i] : true));

/**
 * @return {boolean|undefined}
 */
const looseEqual = (a, b) => {
  if (a === b || (isNaN(a) && isNaN(b))) return true;
};

/**
 * Deep comparison between two values to determine if they are equivalent.
 * default support all primitive data types, object, array, map, set, native date.
 * @param {Function} customizer need return `boolean` or `undefined`.
 * If return `undefined`, comparisons are handled by the method instead
 * @param {*} a
 * @param {*} b
 * @return {boolean}
 */
export function deepEqualWith(customizer, a, b) {
  const val1 = convert(a);
  const val2 = convert(b);
  const result = customizer(val1, val2);
  if (result) return true;

  if (result === undefined && isObject(val1) && isObject(val2)) {
    if (equalFn(typeOf, [val1, val2]) && equalFn(getSize, [val1, val2])) {
      return Object.keys(val1).every(k => deepEqualWith(customizer, val1[k], val2[k]));
    }
  }

  return false;
}

/**
 * Deep comparison, use the default comparison function to handle
 * @param {*} a
 * @param {*} b
 * @return {boolean}
 */
export function deepEqual(a, b) {
  return deepEqualWith(looseEqual, a, b);
}
