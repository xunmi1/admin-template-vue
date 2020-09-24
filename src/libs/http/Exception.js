import BaseClient from '@xunmi/http-client';

export default class Exception extends BaseClient.Exception {
  static NETWORK_ERROR = 'NetworkError';
}
