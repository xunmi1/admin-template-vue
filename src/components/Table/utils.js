import { deepEqual, isString, isFunction } from '@/libs/utils';

export const equal = deepEqual;

const PROP_NAME_REGEX = /\[(?:(\d+)|['"](.+)['"])]|\.(\w+)|^(?:(\w+)|['"](.+)['"])/gi;

export function toPath(data, path) {
  if (isString(path)) {
    const result = [];
    path.replace(PROP_NAME_REGEX, (...rest) => {
      const groups = rest.slice(1, -2);
      result.push(groups.find(Boolean));
    });

    return result.reduce((total, key) => total[key], data);
  }

  if (isFunction(path)) return path(data);
  return data;
}

export function slice(data, { current = 1, pageSize }) {
  const start = (current - 1) * pageSize;
  return data.slice(start, start + pageSize);
}
