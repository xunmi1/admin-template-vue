import axios from 'axios';

const CancelToken = axios.CancelToken;

/**
 * 取消请求
 * 调用时使用 new 生成实例，将实例的 [global]token() 传递请求方法, 调用实例的 [global]cancel() 即可取消请求
 * @function globalCancel 取消所有请求; 与 globalToken 对应
 * @function globalToken 生成统一令牌 token; 与 globalCancel 对应
 * @function token 参数 name: 唯一标识， 生成令牌 token; 与 cancel 对应
 * @function cancel 参数 name: 唯一标识，根据 name 取消对应 token 的请求; 与 token 对应
 */
const CancelRequest = function() {
  this.globalCancel = null;
  this.globalToken = function() {
    if (this.__token) {
      return this.__token;
    }
    return (this.__token = new CancelToken(fn => (this.globalCancel = fn)));
  };

  this.__list = new Map();
  this.cancel = function(name, params) {
    if (name != null && typeof this.__list.get(name) === 'function') {
      const fn = this.__list.get(name)(params);
      this.__list.delete(name);
      return fn;
    }
    throw new Error('未声明对应的令牌 token');
  };
  this.token = function(name) {
    if (name != null) {
      return new CancelToken(fn => this.__list.set(name, fn));
    }
    throw new Error('缺少令牌 token 标识');
  };
};

export default CancelRequest;
