// 类型校验
export function typeOf (obj, type) {
    const toString = Object.prototype.toString;
    const result = toString.call(obj).slice(8, -1).toLowerCase();
    return type ? result === type.toLowerCase() : result;
}

// 深度拷贝
export function deepCopy (data) {
    const t = typeOf(data);
    let o;

    if (t === 'array') {
        o = [];
    } else if (t === 'object') {
        o = {};
    } else {
        return data;
    }

    if (t === 'array') {
        for (let i = 0; i < data.length; i++) {
            o.push(deepCopy(data[i]));
        }
    } else if (t === 'object') {
        for (let i in data) {
            if (data.hasOwnProperty(i)) {
                o[i] = deepCopy(data[i]);
            }
        }
    }
    return o;
}

/**
 * 数组去重
 * @param {...Array} arguments 原数组，不限数组个数
 * @returns {*[]} 去重后的新数组
 */
export function unique () {
    return Array.from(new Set([].concat(...arguments)));
}
