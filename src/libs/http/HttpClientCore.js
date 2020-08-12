import axios from 'axios';
import { isFunction, isArray, isObject } from '@/libs/utils';
import HttpClientContext from './HttpClientContext';
import ResponseError from './ResponseError';
import compose from './compose';

/**
 * @async
 * @callback MiddlewareNext
 * @return {Promise<*>}
 */

/**
 * @typedef {{ data: any, headers: object, status: number, statusText: string }} HttpResponse
 */

class HttpClientCore {
  constructor(config) {
    /** @protected */
    this.instance = axios.create(config);
    /** @private */
    this._middlewares = [];
    this.requestMiddleware = this.requestMiddleware.bind(this);
  }

  static isAborted(error) {
    return isObject(error) && axios.isCancel(error);
  }

  /** @private */
  createContext(options) {
    return new HttpClientContext(options);
  }

  /**
   * @private
   * @param {HttpClientContext} ctx
   * @return {Promise<HttpResponse>}
   */
  async requestMiddleware(ctx) {
    const options = ctx.options ?? {};
    try {
      const data = await this.instance.request(options);
      // eslint-disable-next-line no-unused-vars
      const { config, request, ...response } = data;
      [ctx.request, ctx.response] = [request, response];
      return response;
    } catch (error) {
      if (error.isAxiosError || HttpClientCore.isAborted(error)) {
        // eslint-disable-next-line no-unused-vars
        const { config, request, ...response } = error.response || {};
        [ctx.request, ctx.response] = [request || error.request, response];
        return Promise.reject(new ResponseError(error.message, { request, response }));
      }
      return Promise.reject(error);
    }
  }

  /** @private */
  collectMiddlewares(instanceMiddlewares) {
    return [...this._middlewares, ...instanceMiddlewares, this.requestMiddleware].filter(isFunction);
  }

  use(middleware) {
    if (!isFunction(middleware)) throw new TypeError('middleware must be a function!');
    this._middlewares.push(middleware);
    return this;
  }

  request(url, options, middlewares = []) {
    const context = this.createContext({ url, ...options });
    const instanceMiddlewares = isArray(middlewares) ? middlewares : [middlewares];
    const allMiddlewares = this.collectMiddlewares(instanceMiddlewares);
    return compose(allMiddlewares)(context);
  }
}

export default HttpClientCore;
