import axios from 'axios';
import BaseClient from '@xunmi/http-client';
import { isObject } from '@/libs/utils';
import AxiosContext from './AxiosContext';
import Exception from './Exception';

/**
 * @async
 * @callback AxiosNext
 * @return {Promise<*>}
 */

/**
 * @typedef {{ data: any, headers: object, status: number, statusText: string }} HttpResponse
 */

const getErrorType = error => {
  const isAborted = Core.isAborted(error);
  return error.message === 'Network Error'
    ? Exception.NETWORK_ERROR
    : isAborted
    ? Exception.ABORT_ERROR
    : error.code === 'ECONNABORTED'
    ? Exception.TIMEOUT_ERROR
    : Exception.HTTP_ERROR;
};

export default class Core extends BaseClient.Model {
  constructor(config) {
    super();
    /** @private */
    this.coreMiddleware = this.coreMiddleware.bind(this);
    /** @private */
    this.instance = axios.create(config);

    const methods = ['get', 'post', 'delete', 'put', 'patch', 'head', 'options'];
    methods.forEach(method => {
      this[method] = (url, options) => this.request(url, { ...options, method });
    });
  }

  static isAborted(error) {
    return isObject(error) && axios.isCancel(error);
  }

  get defaults() {
    return this.instance.defaults;
  }

  /**
   * @private
   * @param {Context} ctx
   * @return {Promise<HttpResponse>}
   */
  async coreMiddleware(ctx) {
    try {
      const data = await this.instance.request(ctx.request);
      // eslint-disable-next-line no-unused-vars
      const { config, request, ...response } = data;
      ctx.response = response;
      return response;
    } catch (error) {
      if (error instanceof Error) {
        // eslint-disable-next-line no-unused-vars
        const { config, request, ...response } = error?.response ?? {};
        ctx.response = response;
        throw new Exception(error, getErrorType(error), ctx);
      }
      return Promise.reject(error);
    }
  }

  request(url, options) {
    const ctx = new AxiosContext(url, options);
    return this.compose()(ctx);
  }
}
