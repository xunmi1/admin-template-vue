import config from '@/config';
import { loadRoutes } from '@/router/routerUtils';

/**
 * path: string               仅第一级路径 path 前面加 '/'
 * meta: {
 *   title: string           显示在侧边栏、面包屑和标签栏的文字
 *   hideInBread: (false)    true: 此级路由将不会出现在面包屑中(预留)
 *   hideInMenu: (false)     true: 在菜单不会显示该页面选项, **及其嵌套的子路由页面**
 *   notCache: (false)       true: 页面在切换标签后, **及其嵌套的子路由页面不会缓存**
 *   notAuth: (false)        true: 页面不需要验权，**若存在父级路由，所有父级路由也需设置 true，才能生效**
 *   icon: string            该页面在菜单、面包屑和标签导航处显示的图标
 * }
 */

export default [
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
];
