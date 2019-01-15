/**
 * 封装 axios
 * 添加请求、响应拦截器，自定义 token 和 status 验证规则,
 * 可选: 错误日志收集
 * Author: xunmi
 * Date: 2018-12-23 9:10:00
 */
import axios from 'axios';

interface TokenConfig {
    value: string | null,
    position: 'headers' | 'params' | 'data',
    key: string
}

class AxiosRequest {
    config: {
        baseURL: string;
        headers?: any;
        params?: any
    };
    tokenConfig: TokenConfig
    queue: any;

    constructor (baseUrl: string) {
        this.config = {
            baseURL: baseUrl,
            headers: {},
            params: {}
        };
        this.tokenConfig = {
            value: '',
            position: 'headers',
            key: ''
        };
        // 当前请求队列，为界面动画交互预留，暂时不用
        this.queue = {};
    }

    static failCodeMap : Map<number, {msg: string, handler?: Function}>;
    static extendErrorHooks: Function;

    static handlerError (error: any) {
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

    static use (rules: Map<number, {msg: string, handler?: Function}>) {
        this.failCodeMap = rules;
    }

    static addError (fn: Function) {
        this.extendErrorHooks = fn;
    }

    destroy (url: string) {
        delete this.queue[url];
    }

    static addErrorLog (errorInfo: any) {
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

    interceptors (instance: any, url: string) {
        // 请求拦截
        instance.interceptors.request.use((config: any) => {
            this.queue[url] = true;
            if (this.tokenConfig.value) {
                config[this.tokenConfig.position][this.tokenConfig.key] = this.tokenConfig.value;
            }
            return config;
        }, (error: any) => {
            return Promise.reject(error);
        });
        // 响应拦截
        instance.interceptors.response.use((res: any) => {
            // res.status 为 2** 进入这里
            this.destroy(url);
            return res.data;
        }, (error: any) => {
            this.destroy(url);
            return AxiosRequest.handlerError(error);
        });
    }

    request (options: any) {
        const instance = axios.create();
        options = Object.assign({}, this.config, options);
        this.interceptors(instance, options.url);
        return instance(options);
    }
}

export default AxiosRequest;
