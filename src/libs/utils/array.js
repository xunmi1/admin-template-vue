import { isArray } from './type';

/**
 * 数组去重
 * @param {*[]} arr - 原数组，不限数组个数
 * @returns {*[]} - 去重后的新数组
 */
export function unique(arr) {
  return Array.from(new Set([].concat(arr)));
}

/**
 * 数组扁平化
 * @param {*[]} arr 原数组
 * @return {*[]} - 降维后的数组
 */
export function flatten(arr) {
  if (!isArray(arr)) return [];
  if (Array.prototype.flat) return arr.flat(Infinity);
  return arr.reduce((prev, cur) => prev.concat(isArray(cur) ? flatten(cur) : cur), []);
}
