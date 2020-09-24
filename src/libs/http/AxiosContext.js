export default class AxiosContext {
  constructor(url, options) {
    /** @type AxiosRequestConfig */
    this.request = { url, ...options };
    /** @type {HttpResponse|undefined} */
    this.response = undefined;
  }
  get url() {
    return this.request.url;
  }
  get method() {
    return this.request.method;
  }
  get status() {
    return this.response?.status;
  }
  get statusText() {
    return this.response?.statusText;
  }
  get headers() {
    return this.response?.headers;
  }
  get data() {
    return this.response?.data;
  }
}
