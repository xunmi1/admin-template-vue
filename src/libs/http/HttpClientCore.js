import axios from 'axios';
import { isFunction, isArray, isObject } from '@/libs/utils';
import compose from './compose';

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
    return { options, request: undefined, response: undefined, config: undefined };
  }

  /** @private */
  requestMiddleware(ctx, next) {
    const options = ctx?.options ?? {};
    return this.instance
      .request(options)
      .then(result => {
        const { config, request, ...res } = result;
        [ctx.config, ctx.request, ctx.response] = [config, request, res];
        next();
        return res;
      })
      .catch(err => {
        [ctx.config, ctx.request, ctx.response] = [err.config, err.request, err.response];
        return Promise.reject(err);
      });
  }

  /** @private */
  collectMiddlewares(instanceMiddlewares) {
    return [...this._middlewares, ...instanceMiddlewares, this.requestMiddleware].filter(isFunction);
  }

  use(middleware) {
    this._middlewares.push(middleware);
  }

  request(options, middlewares = []) {
    const context = this.createContext(options);
    const instanceMiddlewares = isArray(middlewares) ? middlewares : [middlewares];
    const allMiddlewares = this.collectMiddlewares(instanceMiddlewares);
    return compose(allMiddlewares)(context);
  }
}

export default HttpClientCore;
