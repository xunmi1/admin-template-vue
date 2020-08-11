class HttpClientContext {
  constructor(options) {
    this.options = options;
    /** @public {XMLHttpRequest|undefined} */
    this.request = undefined;
    /** @public {ContextResponse} */
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

  get body() {
    return this.response?.data;
  }
}

export default HttpClientContext;
