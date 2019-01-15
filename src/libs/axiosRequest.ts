/**
 * 封装 axios
 * 添加请求、响应拦截器，自定义 token 和 status 验证规则,
 * 可选: 错误日志收集
 * Author: xunmi
 * Date: 2018-12-23 9:10:00
 */
import axios from 'axios';

class AxiosRequest {
    constructor (baseUrl) {
        this.config = {
            baseURL: baseUrl,
            headers: {},
            params: {}
        };
        this.tokenConfig = {};
        // 当前请求队列，为界面动画交互预留，暂时不用
        this.queue = {};
    }

    static failCodeMap;
    static extendErrorHooks;

    static handlerError (error) {
        let errorInfo = error.response;
        if (!errorInfo) {
            const { request: { status }, config } = JSON.parse(JSON.stringify(error));
            errorInfo = {
                status,
                request: { responseURL: config.url }
            };
        }
        const failHandler = this.failCodeMap.get(errorInfo.status);
        if (failHandler) {
            errorInfo.message = failHandler.msg;
            this.addErrorLog(errorInfo);
            if (typeof failHandler.handler === 'function') {
                failHandler.handler();
            }
        }
        return Promise.reject(error.response.data);
    }

    static use (rules) {
        this.failCodeMap = rules;
    }

    static addError (fn) {
        this.extendErrorHooks = fn;
    }

    destroy (url) {
        delete this.queue[url];
    }

    static addErrorLog (errorInfo) {
        const { message, status, request: { responseURL }, config: { method } } = errorInfo;
        const info = {
            type: 'ajax',
            code: status,
            message,
            url: responseURL,
            method
        };
        if (typeof this.extendErrorHooks === 'function') {
            this.extendErrorHooks(info);
        }
    }

    interceptors (instance, url) {
        // 请求拦截
        instance.interceptors.request.use(config => {
            this.queue[url] = true;
            if (this.tokenConfig.value) {
                config[this.tokenConfig.position][this.tokenConfig.key] = this.tokenConfig.value;
            }
            return config;
        }, error => {
            return Promise.reject(error);
        });
        // 响应拦截
        instance.interceptors.response.use(res => {
            // res.status 为 2** 进入这里
            this.destroy(url);
            return res.data;
        }, error => {
            this.destroy(url);
            return AxiosRequest.handlerError(error);
        });
    }

    request (options) {
        const instance = axios.create();
        options = Object.assign({}, this.config, options);
        this.interceptors(instance, options.url);
        return instance(options);
    }
}

export default AxiosRequest;
