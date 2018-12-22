import Mock from 'mockjs';
import qs from 'qs';

// 修复 MockJS 导致请求丢 Cookies
// http://cnine.me/note/FrontEnd/mock-lose-cookies-dbg.html
Mock.XHR.prototype.__send = Mock.XHR.prototype.send;
Mock.XHR.prototype.send = function () {
    if (this.custom.xhr)
        this.custom.xhr.withCredentials = this.withCredentials || false;
    this.__send.apply(this, arguments);
};

// 模拟网络延迟
Mock.setup({ timeout: '200-400' });

/* 扩展 [生成器] */
const Generator = (prop, template) => {
    const obj = {};
    obj[prop] = [template];
    return Mock.mock(obj);
};
/* 扩展 [循环] */
const Repeat = (num, itemTemplate) => Generator(`data|${ num }`, itemTemplate).data;

const CustomExtends = {
    Generator,
    Repeat,
    Mock,
    Random: Mock.Random
};
const myMock = {
    extend: (prop, value) => {
        CustomExtends[prop] = value;
    },
    setup: (path, method, handler) => {
        Mock.mock(
            RegExp(path),
            method,
            typeof handler === 'function' ? data => handler(wired(data)) : handler
        );
    },
    load: collection => {
        collection.map(({ path, method, handler }) => {
            if (method === '*') {
                method = ['get', 'post', 'put', 'delete', 'patch'];
            }
            if (typeof method === 'string' && method.indexOf('|') > -1) {
                method = method.split('|');
            }
            if (Array.isArray(method)) {
                method.map(item => myMock.setup(path, item, handler));
            } else {
                myMock.setup(path, method, handler);
            }
        })
    }
};

/* 装配配置组 */
const wired = ({ url, type, body }) => ({
    method: type,
    params: qs.parse(url.split('?').length > 1 ? url.split('?')[1] : ''),
    body: JSON.parse(body),
    url: qs.parse(url.split('?')[0]),
    ...CustomExtends
});

const req = context => context.keys().map(context);
const files = require.context('./api', false, /\.js$/);
req(files).forEach(e => {
    if (e.default) {
        myMock.load(e.default);
    }
});
