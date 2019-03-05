import store from '@/store';
import router from '@/router';
import config from '@/config';
import AxiosRequest from './common/AxiosRequest';

const failAuth = function () {
    // 清空 token
    store.commit('user/setToken');
    router.push({ name: config.loginName });
};

const failCodeMap = new Map([
    [400, { msg: '请求错误' }],
    [401, { msg: '未认证', handler: failAuth }],
    [403, { msg: '未授权', handler: failAuth }],
    [404, { msg: '请求地址错误' }],
    [405, { msg: '请求方式错误' }],
    [408, { msg: '请求超时' }],
    [422, { msg: '验证错误' }],
    [500, { msg: '服务器内部错误' }],
    [501, { msg: '服务未实现' }],
    [502, { msg: '网关错误' }],
    [503, { msg: '服务不可用' }],
    [504, { msg: '网关超时' }],
    [505, { msg: 'HTTP版本不受支持' }]
]);
// 添加 http status 验证信息和规则
AxiosRequest.use(failCodeMap);
// 错误处理，这里用 store 收集错误信息
AxiosRequest.addError(info => {
    store.dispatch('app/addErrorLog', info);
});

class MyRequest extends AxiosRequest {
    setToken (token) {
        this.tokenConfig = {
            ...config.token,
            value: token ? config.token.value.replace('TOKEN', token) : null
        };
    }

    /**
     * 重写 request 方法
     * 加上 api 版本判断， data.notVersion=false, 加上 api 版本号
     * @param {Object} option - 请求配置信息
     * @param {string} option.url - 请求配置信息
     * @param {boolean} [option.notVersion=false] - 是否含有 api 版本号
     * @param {Object} [option.params] -  URL 参数
     * @param {Object} [option.data] - 请求体参数
     * @param {'get'|'post'|'put'|'patch'|'delete'|'head'} [option.method='get'] - 请求方法类型
     * @param {*} [option.cancelToken] - 取消请求令牌
     * @return {Promise} - 包含响应数据的 Promise
     */
    request (option = {}) {
        const url = option.url[0] === '/' ? option.url : '/' + option.url;
        if (!option.notVersion) {
            option.url = config.apiVersion + url;
        }
        return super.request(option);
    }
}

const baseUrl = process.env.NODE_ENV !== 'production'
    ? config.baseUrl.development
    : config.baseUrl.production;
const service = new MyRequest({ baseURL: baseUrl });

export default service;
