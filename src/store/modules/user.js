import { getPermissions, login } from '@/api/user';

import http from '@/libs/http';
import db, { StorageKeys } from '@/libs/db';
import config from '@/config';

export default {
  namespaced: true,
  state: {
    userId: null,
    username: '',
    token: '',
    avatar: '',
    nickname: '',
  },
  getters: {
    status: state => (state.token ? 'online' : 'offline'),
  },
  mutations: {
    setToken(state, { token, remember } = {}) {
      state.token = token;
      const { template, key, expires } = config.auth;
      const signal = token ? template.replace('TOKEN', token) : null;
      http.setHeader(key, signal);
      db.set(StorageKeys.TOKEN, token, { maxAge: expires * 1000 });
      if (remember != null) db.set(StorageKeys.LOGIN_REMEMBER, remember);
    },
    setUserInfo(state, userInfo = {}) {
      Object.entries(userInfo).forEach(([key, value]) => (state[key] = value));
      db.set(StorageKeys.USER_INFO, userInfo);
    },
  },
  actions: {
    async handleLogin({ commit }, { username, password, remember }) {
      const res = await login({ username, password });
      commit('setToken', { token: res.access_token, remember });
      const userInfo = {
        userId: res.info.id,
        avatar: res.info.avatar ?? res.info.nickname,
        nickname: res.info.nickname,
        username: res.info.username,
        email: res.info.email,
      };
      commit('setUserInfo', userInfo);
      return res;
    },

    getPermissions({ state }) {
      return getPermissions({ userId: state.userId });
    },
  },
};
