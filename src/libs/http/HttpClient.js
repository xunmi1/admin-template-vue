import { isArray } from '@/libs/utils';
import Core from './Core';

class HttpClient extends Core {
  get baseURL() {
    return this.defaults.baseURL;
  }

  set baseURL(url) {
    this.defaults.baseURL = url;
  }

  setHeader(key, value, scopes) {
    const headers = this.defaults.headers;
    if (isArray(scopes)) {
      scopes.forEach(scope => (headers[scope][key] = value));
    } else {
      headers.common[key] = value;
    }
  }
}

export default HttpClient;
