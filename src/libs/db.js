import ProxyStorage from './common/ProxyStorage';
import config from '@/config';

// 扩展 ProxyStorage 类，增加静态方法(获取单例)
class MyStorage extends ProxyStorage {
    static getSingle (prefix) {
        this.single = this.single || new Map();
        if (!this.single.has(prefix)) {
            this.single.set(prefix, new MyStorage(prefix));
        }
        return this.single.get(prefix);
    }
}

// 全局使用同一 ProxyStorage 实例
const db = MyStorage.getSingle(config.dbPrefix);

export { db as default, MyStorage };
