import Vue from 'vue';
import VueRouter from 'vue-router';
import config from '@/config';
import db, { StorageKeys } from '@/libs/db';
import store from '@/store';
import routes from './routes';

import { getRoutes, hasRouterAuth, addAliveHook } from './routerUtils';
import { startProgressGuard, endProgressHook } from './progress';

Vue.use(VueRouter);

const vueRouter = new VueRouter({ routes });

export default vueRouter;
export { routes };
export const getVisibleRoutes = decider => getRoutes(routes, decider);

export const navigateToLogin = handler => {
  // 清空 token 数据
  store.commit('user/setToken');
  const loginName = config.loginName;
  if (vueRouter.currentRoute.name === loginName) return;
  if (handler) handler({ name: loginName });
  else vueRouter.push({ name: loginName }).catch(() => {});
};

db.watch(StorageKeys.TOKEN, value => {
  if (!value) navigateToLogin();
});

// Initialize `store` data
const initStoreData = async (token, remember) => {
  store.commit('user/setToken', { token, remember });
  store.commit('user/setUserInfo', db.get(StorageKeys.USER_INFO));
};

const verifyAuthGuard = async (to, from, next) => {
  if (hasRouterAuth(to)) {
    const stateToken = store.state.user.token;
    if (!stateToken) {
      const localToken = db.get(StorageKeys.TOKEN);
      if (!localToken) return navigateToLogin(next);
      const remember = db.get(StorageKeys.LOGIN_REMEMBER);
      if (!remember) return navigateToLogin(next);
      await initStoreData(localToken, remember);
    }
  }
  next();
};

const resetDocumentHook = to => {
  const title = config.title.small;
  const page = to.meta?.title;
  window.document.title = page ? `${page} - ${title}` : title;
  window.scrollTo(0, 0);
};

vueRouter.beforeEach(startProgressGuard);
vueRouter.beforeEach(verifyAuthGuard);

vueRouter.afterEach(addAliveHook);
vueRouter.afterEach(resetDocumentHook);
vueRouter.afterEach(endProgressHook);
