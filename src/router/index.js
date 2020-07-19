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
  if (handler) handler({ name: config.loginName });
  else vueRouter.push({ name: config.loginName });
};

db.watch(StorageKeys.TOKEN, value => {
  if (!value) vueRouter.push({ name: config.loginName });
});

// 初始化 `store` 信息
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
  window.document.title = to.meta?.title ?? config.title.small;
  window.scrollTo(0, 0);
};

vueRouter.beforeEach(startProgressGuard);
vueRouter.beforeEach(verifyAuthGuard);

vueRouter.afterEach(addAliveHook);
vueRouter.afterEach(resetDocumentHook);
vueRouter.afterEach(endProgressHook);
