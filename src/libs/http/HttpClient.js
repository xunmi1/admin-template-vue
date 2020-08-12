import { isArray } from '@/libs/utils';
import HttpClientCore from './HttpClientCore';

class HttpClient extends HttpClientCore {
  constructor(options) {
    super(options);
    const METHODS = ['get', 'post', 'delete', 'put', 'patch', 'head', 'options'];
    METHODS.forEach(method => {
      this[method] = (url, options, ...rest) => this.request(url, { method, ...options }, ...rest);
    });
  }

  get baseURL() {
    return this.instance.defaults.baseURL;
  }

  set baseURL(url) {
    this.instance.defaults.baseURL = url;
  }

  setHeader(key, value, methods) {
    const headers = this.instance.defaults.headers;
    if (isArray(methods)) {
      methods.forEach(method => (headers[method][key] = value));
    } else {
      headers.common[key] = value;
    }
  }
}

export default HttpClient;
