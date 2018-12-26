/**
 * 封装 localStorage
 * Object 自动 JSON 转换，保证数据类型一致，通过 prefix，降低 key 冲突
 * 可选： 设置存储有效期
 * Author: xunmi
 * Date: 2018-12-26 16:50:00
 */

import config from '../config';

class Db {
    constructor (prefix) {
        this._localStorage = localStorage;
        [this.prefix, this.keys] = [prefix, new Set()];
        this.initKeys();
    }

    initKeys () {
        for (let key in this._localStorage) {
            // 或者使用正则从**首位**判断
            if (this._localStorage.hasOwnProperty(key) && key.slice(0, this.prefix.length) === this.prefix) {
                this.keys.add(key);
            }
        }
    }

    initKey (key) {
        if (key.slice(0, this.prefix.length) === this.prefix) {
            return key;
        }
        return `${ this.prefix }-${ key }`;
    }

    /**
     * 添加数据
     * @param key 键名，在内部会转换
     * @param value 键值
     * @param expires 有效期，可选
     */
    set (key, value, expires) {
        key = this.initKey(key);
        const data = {
            value
        };
        if (expires && typeof expires === 'number') {
            data.time = Date.now();
            data.expires = expires;
        }
        this._localStorage.setItem(key, JSON.stringify(data));
        this.keys.add(key);
    }

    /**
     * 访问数据
     * @param key 键名
     * @returns {*} 键值， 若过期，则自动删除，返回 false
     */
    get (key) {
        key = this.initKey(key);
        const data = JSON.parse(this._localStorage.getItem(key) || '{}');
        if (data && data.value) {
            if (data.time) {
                const valid = (Date.now() - data.time) < data.expires;
                return valid ? data.value : !this.del(key);
            }
            return data.value;
        }
        return false;
    }

    del (key) {
        key = this.initKey(key);
        if (this.keys.has(key)) {
            this._localStorage.removeItem(key);
            return this.keys.delete(key);
        }
        return false;
    }

    clear () {
        this.keys.forEach(key => {
            this.del(key);
        });
    }
    // 这里没有判断 prefix，如果需要其他 prefix，直接 new Db(prefix);
    // 不推荐一个系统中存在多个不同的 prefix
    static getSingle (prefix = config.dbPrefix) {
        if (!this.single) {
            this.single = new Db(prefix);
        }
        return this.single;
    }
}

export default Db;
