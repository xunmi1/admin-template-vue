// 工具函数库
// 注意: 请勿使用箭头函数声明

/**
 * 数据类型校验
 * @param {*} obj 需要校验的数据，推荐同时使用第二个参数 type
 * @param {string|string[]} [type] - 目标类型，可以包含可能类型的数组
 * @returns {string|boolean} - 数据类型(全小写)或校验结果
 */
export function typeOf (obj, type) {
    const toString = Object.prototype.toString;
    const result = toString.call(obj).slice(8, -1).toLowerCase();
    if (type) {
        const __type = toString.call(type).slice(8, -1).toLowerCase();
        if (__type === 'string') {
            return result.search(type.toLowerCase()) !== -1;
        }
        if (__type === 'array' && type.length) {
            return type.some(i => result.search(i.toLowerCase()) !== -1);
        }
    }
    return result;
}

/**
 * 对象深度复制，注: 不支持 Map | Set 等类似数据类型
 * @param {*} data - 原始数据
 * @returns {*} - 复制后的数据
 */
export function deepCopy (data) {
    const type = typeOf(data);
    let target;

    if (type === 'array') {
        target = [];
    } else if (type === 'object') {
        target = {};
    } else {
        return data;
    }

    if (type === 'array') {
        data.forEach(item => target.push(deepCopy(item)));
    } else if (type === 'object') {
        Object.keys(type).forEach(key => target[key] = deepCopy(data[key]));
    }
    return target;
}

/**
 * 对象深度冻结，会修改原数据，注: 不支持 Map | Set 等类似数据类型
 * @param {Object} obj 需要冻结的数据
 * @returns {Object} 冻结后的数据
 */
export function deepFreeze (obj) {
    if (typeof obj === 'object' && !Object.isFrozen(obj)) {
        Object.freeze(obj);
        Object.keys(obj).forEach(property => deepFreeze(obj[property]));
    }
    return obj;
}

/**
 * 数组去重
 * @param {...Array} rest - 原数组，不限数组个数
 * @returns {*[]} - 去重后的新数组
 */
export function unique (...rest) {
    return Array.from(new Set([].concat(...rest)));
}

/**
 * 数组扁平化(会移除空项)
 * @param {Array} arr 原数组
 * @param {Number} [depth=Infinity] 嵌套深度
 * @return {Array} - 降维后的数组
 */
export function flatten (arr, depth = Infinity) {
    // old
    // return arr.reduce((prev, cur) => prev.concat(Array.isArray(cur) ? flatten(cur) : cur), []);
    // new
    if (Array.isArray(arr)) {
        return arr.flat(depth);
    }
}

/**
 * 数组中删除指定元素
 * @param arr 数组
 * @param item 指定元素
 * @return {Array} 删除后数组
 */
export function remove (arr, item) {
    if (Array.isArray(arr) && item !== undefined) {
        const _index = arr.indexOf(item);
        if (_index < 0) return arr;
        const _temp = [...arr];
        _temp.splice(_index, 1);
        return remove(_temp, item);
    }
}

/**
 * 节流|防抖函数: 期间执行最后一次触发的函数
 * @param {Function} fn - 需要节流|防抖的函数
 * @param {number} [interval=0] - 间隔 ms, 默认 0
 * @param {boolean} [resetInterval=false] - 是否立即重置间隔, 设置 true 时为防抖函数
 * @returns {Function} - 已节流函数
 */
export function throttle (fn, interval = 0, resetInterval = false) {
    let [_self, timer, isFirst] = [fn, undefined, true];
    return function () {
        if (isFirst && !resetInterval) {
            _self.apply(this, arguments);
            return isFirst = false;
        }
        if (timer) {
            if (resetInterval) {
                clearTimeout(timer);
                timer = undefined;
            } else {
                return false;
            }
        }
        timer = setTimeout(() => {
            clearTimeout(timer);
            timer = undefined;
            _self.apply(this, arguments);
        }, interval);
    };
}

const formatNumber = function (n) {
    n = n.toString();
    return n[1] ? n : '0' + n;
};

/**
 * 转化为时间字符串
 * @param {Date|number} date - Date 对象或时间戳(ms)
 * @param {boolean} [isFull=false] - 是否为完整日期时间
 * @param {string} [connector='-'] - 连接符
 * @returns {string} - yyyy-MM-dd
 */
export function dateFormat (date, isFull = false, connector = '-') {
    let __date = null;
    if (typeOf(date, 'number')) {
        __date = new Date(date);
    } else if (typeOf(date, 'date')) {
        __date = date;
    } else {
        return '';
    }
    let str = [__date.getFullYear(), __date.getMonth() + 1, __date.getDate()].map(formatNumber).join(connector);
    if (isFull) {
        str += ' ' + [__date.getHours(), __date.getMinutes(), __date.getSeconds()].map(formatNumber).join(':');
    }
    return str;
}

/**
 * 转换为时间戳
 * @param {Date|string} date - Date 对象或时间字符串
 * @param {'ms'|'s'} [type='ms'] - 单位: ms 或 s
 * @returns {number|undefined} - 时间戳
 */
export function getTime (date, type = 'ms') {
    let __date = null;
    if (typeOf(date, 'string')) {
        __date = new Date(date.substring(0, 19).replace(/-/g, '/'));
    } else if (typeOf(date, 'date')) {
        __date = date;
    } else {
        return;
    }

    if (!type || type === 'ms') return __date.getTime();
    if (type === 's') return Math.floor(__date.getTime() / 1000);
}
