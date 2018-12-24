import store from '@/store';
import AxiosRequest from '@/libs/axiosRequest';
import config from '@/config';

const failCodeMap = new Map([
    [400, { msg: '请求错误' }],
    [401, {
        msg: '未认证', handler () {
            store.commit('setToken');
        }
    }],
    [403, {
        msg: '未授权', handler () {
            store.commit('setToken');
        }
    }],
    [404, { msg: '请求地址错误' }],
    [405, { msg: '请求方式错误' }],
    [408, { msg: '请求超时' }],
    [422, {
        msg: '验证错误', handler () {
            store.commit('setToken');
        }
    }],
    [500, { msg: '服务器内部错误' }],
    [501, { msg: '服务未实现' }],
    [502, { msg: '网关错误' }],
    [503, { msg: '服务不可用' }],
    [504, { msg: '网关超时' }],
    [505, { msg: 'HTTP版本不受支持' }]
]);
AxiosRequest.use(failCodeMap);
AxiosRequest.addError(info => {
    store.dispatch('addErrorLog', info);
});
const baseUrl = process.env.NODE_ENV !== 'production' ? config.baseUrl.dev : config.baseUrl.pro;
const service = new AxiosRequest(baseUrl);
service.setToken = function (token) {
    this.tokenConfig = {
        ...config.token,
        value: `Bearer ${ token }`
    };
};
export default service;
