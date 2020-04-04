import LightStorage from 'light-storage';
import config from '@/config';
import { StorageKeys } from '@/constants';

// 将 StorageKeys 同时导出，便于使用
export { StorageKeys };

/**
 * 劫持 LightStorage 实例，验证 key 值是否属于 StorageKeys
 * @param {LightStorage} instance
 * @return {LightStorage}
 */
const proxyStorage = instance => {
  const collectionKeys = Object.values(StorageKeys);

  const handler = {
    apply(target, context, rest) {
      const key = rest[0];
      if (!collectionKeys.includes(key)) {
        // eslint-disable-next-line
        console.error(`unsafe storage key: ${key}, and key must be in the StorageKeys`);
      }
      return target.apply(context, rest);
    },
  };

  instance.set = new Proxy(instance.set, handler);
  instance.get = new Proxy(instance.get, handler);

  return instance;
};

const isProduction = process.env.NODE_ENV === 'production';

const lightStorage = new LightStorage(config.dbPrefix);
const db = isProduction ? lightStorage : proxyStorage(lightStorage);

export default db;
