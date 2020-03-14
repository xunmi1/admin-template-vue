import { CancelToken } from 'axios';

class AbortRequest {
  constructor() {
    /** @private */
    this.controllerMap = new Map();
  }

  /**
   * @param signal {string}
   * @return {CancelToken}
   */
  create(signal) {
    if (this.has(signal)) return this.get(signal).token;
    const controller = CancelToken.source();
    this.set(signal, controller);
    return controller.token;
  }

  /**
   * @param signal {string}
   * @param [message] {string}
   * @return {boolean}
   */
  abort(signal, message) {
    if (!this.has(signal)) return false;
    const { cancel } = this.get(signal);
    cancel(message);
    this.delete(signal);
    return true;
  }

  has(signal) {
    return this.controllerMap.has(signal);
  }

  /**
   * @private
   */
  set(signal, controller) {
    this.controllerMap.set(signal, controller);
  }

  /**
   * @private
   */
  get(signal) {
    return this.controllerMap.get(signal);
  }

  /**
   * @private
   * @param signal
   * @return {boolean}
   */
  delete(signal) {
    return this.controllerMap.delete(signal);
  }
}

export default AbortRequest;
