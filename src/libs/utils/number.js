import { isNaN } from './type';

/**
 * Convert to `number`, default is `0`
 * @param {string} val
 * @return {number}
 */
export const toNumber = val => {
  const result = Number.parseFloat(val);
  return isNaN(result) ? 0 : result;
};
