/**
 * 保存应用的静态常量、枚举等
 */

const freeze = Object.freeze;

/** 本地存储中的 key */
export const StorageKeys = freeze({
  TOKEN: 'token',
  USER_INFO: 'user-info',
  LOGIN_REMEMBER: 'login-remember',
  BASIC_LAYOUT: 'basic-layout',
});
