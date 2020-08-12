class HttpClientContext {
  constructor(options) {
    this.options = options;
    /** @type {XMLHttpRequest|undefined} */
    this.request = undefined;
    /** @type {HttpResponse|undefined} */
    this.response = undefined;
  }

  get status() {
    return this.request?.status;
  }

  get url() {
    return this.options.url;
  }

  get method() {
    return this.options.method;
  }

  get headers() {
    return this.response?.headers;
  }

  get data() {
    return this.response?.data;
  }
}

export default HttpClientContext;
