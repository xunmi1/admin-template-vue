import { isArray } from './type';

/**
 * 数组去重
 * @param {Array} arr - 原数组，不限数组个数
 * @returns {*[]} - 去重后的新数组
 */
export function unique(arr) {
  return Array.from(new Set([].concat(arr)));
}

/**
 * 数组扁平化(会移除空项)
 * @param {Array} arr 原数组
 * @return {Array} - 降维后的数组
 */
export function flatten(arr) {
  if (!isArray(arr)) return [];
  if (Array.prototype.flat) return arr.flat(Infinity);
  return arr.reduce((prev, cur) => prev.concat(isArray(cur) ? flatten(cur) : cur), []);
}

/**
 * 数组中删除指定元素
 * @param arr 数组
 * @param item 指定元素
 * @return {Array} 删除后数组
 */
export function remove(arr, item) {
  if (isArray(arr)) {
    const index = arr.indexOf(item);
    if (index < 0) return arr;
    const temp = [...arr];
    temp.splice(index, 1);
    return remove(temp, item);
  }
}
