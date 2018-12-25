import Vue from 'vue';
import Router from 'vue-router';

import others from './modules/others';

Vue.use(Router);
/**
 * meta: {
 *  title: { String|Number|Function }
 *         显示在侧边栏、面包屑和标签栏的文字
 *         可以传入一个回调函数，参数是当前路由对象，例子看动态路由和带参路由
 *  hideInBread: (false) 设为true后此级路由将不会出现在面包屑中
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面在切换标签后不会缓存
 *  icon: 该页面在左侧菜单、面包屑和标签导航处显示的图标
 * }
 */
const router = new Router({
    routes: [
        ...others
    ]
});

router.beforeEach((to, from, next) => {
    next();
});
router.afterEach(to => {
    window.document.title = to.meta.title;
    window.scrollTo(0, 0);
});

export default router
