/**
 * 封装 axios
 * 添加请求、响应拦截器，自定义 token 和 status 验证规则,
 * 可选: 错误日志收集
 * Author: xunmi
 * Date: 2018-12-23 9:10:00
 */
import axios from 'axios';

class AxiosRequest {
    constructor (config = {}) {
        this.defaultConfig = {
            method: 'get',
            ...config,
        };
        this.tokenConfig = {};
        // 当前请求队列，为界面动画交互预留，暂时不用
        this.queue = {};
    }

    static failCodeMap;
    static extendErrorHooks;

    static handlerError (ctx) {
        try {
            const error = ctx.response;
            const failHandler = AxiosRequest.failCodeMap.get(error.status);
            if (failHandler) {
                error.message = failHandler.msg;
                AxiosRequest.addErrorLog(error);
                if (typeof failHandler.handler === 'function') {
                    failHandler.handler(error);
                }
            }
            return Promise.reject(error);
        } catch {
            throw new Error(ctx);
        }
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

    static addErrorLog (error) {
        const { message, status, request: { responseURL }, config: { method } } = error;
        const info = {
            type: 'ajax',
            code: status,
            message,
            url: responseURL,
            method,
        };
        if (typeof AxiosRequest.extendErrorHooks === 'function') {
            AxiosRequest.extendErrorHooks(info);
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
        }, error => Promise.reject(error));
        // 响应拦截
        instance.interceptors.response.use(res => {
            // res.status 为 2** 进入这里
            this.destroy(url);
            return res;
        }, error => {
            this.destroy(url);
            if (error.constructor.name === 'Cancel') return Promise.reject(error);
            return AxiosRequest.handlerError(error);
        });
    }

    request (options = {}) {
        const instance = axios.create();
        if (!options.url) {
            throw new Error('缺少请求地址!');
        }
        this.interceptors(instance, options.url);
        return instance.request({ ...this.defaultConfig, ...options });
    }
}

export default AxiosRequest;
