class ResponseError extends Error {
  /**
   * @param {string} message
   * @param {HttpResponse} [response]
   * @param {XMLHttpRequest} [request]
   */
  constructor(message, { response, request } = {}) {
    super(message ?? response?.statusText);
    this.name = this.constructor.name;
    this.response = response;
    this.request = request;
  }
}

export default ResponseError;
