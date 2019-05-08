import LightStorage from 'light-storage';
import config from '@/config';

// 全局使用同一 ProxyStorage 实例
const db = new LightStorage(config.dbPrefix);
export default db;
