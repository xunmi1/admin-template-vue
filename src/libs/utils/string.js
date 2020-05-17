import { isString } from './type';
import { cache } from './func';

const CAMELIZE_REGEX = /[\s_-]+([^\s_-])/g;
/**
 * Convert to `camelCase`
 * @param {string} str
 * @return {string}
 */
export const camelize = cache(str => str.replace(CAMELIZE_REGEX, (_, k) => k?.toUpperCase() ?? ''));

/** 还原转义字符 */
const undoEscapeChar = str => {
  let node = window.document.createElement('div');
  node.innerHTML = str;
  const text = node.innerText ?? node.textContent;
  node = null;
  return text;
};

const PLAIN_TEXT_REGEX = /<.+?>/g;
/**
 * Get plain text from HTML string
 * @param {string} str
 * @return {string}
 */
export const getPlainText = cache(str => (isString(str) ? undoEscapeChar(str.replace(PLAIN_TEXT_REGEX, '')) : ''));
