import { cache } from '@/libs/utils/func';

const CAMELIZE_REGEX = /[\s_-]+([^\s_-])/g;
/**
 * Convert to `camelCase`
 * @param {string} str
 * @return {string}
 */
export const camelize = cache(str => str.replace(CAMELIZE_REGEX, (_, $1) => $1?.toUpperCase() ?? ''));
