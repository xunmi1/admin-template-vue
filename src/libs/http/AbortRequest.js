import axios from 'axios';

/**
 * @typedef {string|number|symbol} Signal
 */

class AbortRequest {
  constructor() {
    /** @private */
    this._controllerMap = new Map();
  }

  /**
   * @param signal {Signal}
   * @return {CancelToken}
   */
  create(signal) {
    if (this.has(signal)) return this.get(signal).token;
    const controller = axios.CancelToken.source();
    this.set(signal, controller);
    return controller.token;
  }

  /**
   * @param signal {Signal}
   * @param [message] {string}
   * @return {boolean}
   */
  abort(signal, message) {
    const controller = this.get(signal);
    if (!controller) return false;
    controller.cancel(message);
    this.delete(signal);
    return true;
  }

  /**
   * @param signal {Signal}
   * @return {boolean}
   */
  has(signal) {
    return this._controllerMap.has(signal);
  }

  /**
   * @private
   * @param signal {Signal}
   * @param controller {CancelTokenSource}
   */
  set(signal, controller) {
    this._controllerMap.set(signal, controller);
  }

  /**
   * @private
   * @param signal {Signal}
   */
  get(signal) {
    return this._controllerMap.get(signal);
  }

  /**
   * @private
   * @param signal {Signal}
   * @return {boolean}
   */
  delete(signal) {
    return this._controllerMap.delete(signal);
  }
}

export default AbortRequest;
