import Vue from 'vue';
import VueRouter from 'vue-router';
import NProgress from 'nprogress';
import config from '@/config';
import db from '@/libs/db';
import store from '@/store';

Vue.use(VueRouter);
/**
 * 加载路由
 * @param files 文件, 使用 `require.context()` 获取
 * @return {Array} 路由数组
 */
const loadRoutes = files =>
  files
    .keys()
    .reduce((arr, key) => (typeof files(key).default === 'object' ? arr.concat(files(key).default) : arr), [])
    .sort((prev, next) => (prev.sort || 0) - (next.sort || 0));

/**
 * path: string               仅第一级路径 path 前面加 '/'
 * meta: {
 *    title: string           显示在侧边栏、面包屑和标签栏的文字
 *    hideInBread: (false)    true: 此级路由将不会出现在面包屑中(预留)
 *    hideInMenu: (false)     true: 在菜单不会显示该页面选项, **及其嵌套的子路由页面**
 *    notCache: (false)       true: 页面在切换标签后, **及其嵌套的子路由页面不会缓存**
 *    notAuth: (false)        true: 页面不需要验权，**若存在父级路由，所有父级路由也需设置 true，才能生效**
 *    icon: string            该页面在菜单、面包屑和标签导航处显示的图标
 * }
 */
const router = new VueRouter({
  routes: [
    {
      path: '/',
      name: config.mainName,
      redirect: { name: 'Test11' },
      meta: { title: '首页' },
      component: () => import(/* webpackChunkName: "BasicLayout" */ '@/views/Layout/BasicLayout'),
      children: loadRoutes(require.context('./BasicLayout', false, /\.js$/)),
    },
    {
      path: '/user',
      name: 'User',
      redirect: { name: config.loginName },
      meta: {
        notAuth: true,
        notCache: true,
      },
      component: () => import(/* webpackChunkName: "UserLayout" */ '@/views/Layout/UserLayout'),
      children: loadRoutes(require.context('./UserLayout', false, /\.js$/)),
    },
  ],
});

// 系统全局权限路由检查 如果前往路由的路由记录上有一个设置了验权, 则进行 token 校验
// 类似于 'login' 等不验权的页面，需要其路由记录上，全部为 notAuth = true 时, 才会生效
const checkRouterAuth = to => !to.matched.every(r => r.meta.notAuth);

router.beforeEach((_, __, next) => {
  NProgress.start();
  next();
});

router.beforeEach(async (to, from, next) => {
  if (checkRouterAuth(to)) {
    const stateToken = store.state.user.token;
    if (!stateToken) {
      const localToken = db.get('token');
      if (!localToken) return navigateToLogin(next);
      const remember = db.get('remember');
      if (!remember) return navigateToLogin(next);
      await initStoreData(localToken, remember);
    }
  }
  next();
});

router.afterEach(to => {
  Promise.resolve().then(() => {
    addAlive(to);
    NProgress.done();
  });
  window.document.title = to.meta.title || config.title.small;
  window.scrollTo(0, 0);
});

export default router;

// 初始化 `store` 信息
const initStoreData = async (token, remember) => {
  store.commit('user/setToken', { token, remember });
  store.commit('user/setUserInfo', db.get('userInfo'));
};

const addAlive = function(to) {
  const length = to.matched.length;
  if (length > 1) {
    for (let i = length - 1; i > 0; i--) {
      const [own, parent] = [to.matched[i], to.matched[i - 1]];
      if (!(own.meta && own.meta.notCache)) {
        Object.keys(own.components).forEach(key => {
          // 注意： 父级组件不支持多个 router-view
          store.commit('app/addAlive', {
            page: parent.components.default.name,
            type: key,
            alive: own.components[key].name,
          });
        });
      }
    }
  }
};

export const navigateToLogin = function(handler) {
  // 清空 token 数据
  store.commit('user/setToken');
  if (handler) handler({ name: config.loginName });
  else router.push({ name: config.loginName });
};
