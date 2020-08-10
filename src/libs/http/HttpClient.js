import axios from 'axios';
import compose from './compose';
import { isFunction, isArray } from '@/libs/utils';

export class HttpClient {
  constructor(config) {
    /** @private */
    this.instance = axios.create(config);
    /** @private */
    this.middlewares = [];
    this.requestMiddleware = this.requestMiddleware.bind(this);
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

  use(middleware) {
    this.middlewares.push(middleware);
  }
  /** @private */
  collectMiddlewares(instanceMiddlewares) {
    return [...this.middlewares, ...instanceMiddlewares, this.requestMiddleware].filter(isFunction);
  }

  request(options, middlewares = []) {
    const context = this.createContext(options);
    const instanceMiddlewares = isArray(middlewares) ? middlewares : [middlewares];
    const allMiddlewares = this.collectMiddlewares(instanceMiddlewares);
    return compose(allMiddlewares)(context);
  }

  setHeader(key, value) {
    this.instance.defaults.headers[key] = value;
  }
}

export default HttpClient;
