import config from '../config';
import Db from '../libs/db';
import store from '../store';
import Router from 'vue-router';

import others from './modules/others';
import page1 from './modules/page1';
import page2 from './modules/page2';
import page3 from './modules/page3';

/**
 * meta: {
 *    title: string           显示在侧边栏、面包屑和标签栏的文字
 *    hideInBread: (false)    true = 此级路由将不会出现在面包屑中
 *    hideInMenu: (false)     true = 在左侧菜单不会显示该页面选项
 *    notCache: (false)       true = 页面在切换标签后不会缓存
 *    notAuth: (false)        true = 页面不需要验权
 *    icon: string            该页面在菜单、面包屑和标签导航处显示的图标
 * }
 */
const router = new Router({
    routes: [
        ...others,
        {
            path: '/',
            name: 'BasicLayout',
            meta: {
                title: '测试'
            },
            component: () => import(/* webpackChunkName: "BasicLayout" */ '@/views/Layout/BasicLayout'),
            children: [
                ...page1,
                ...page2,
                ...page3
            ]
        }
    ]
});
const db = Db.getSingle();

router.beforeEach((to, from, next) => {
    // 如果前往路由的路由记录上有一个设置了验权 (!notAuth), 则进行 token 校验
    // matched 路由记录： 当前路由所在嵌套路径上，从顶层到本层的所有路由对象
    // 因此，类似于 'login' 等不验权的页面，需要其路由记录上，全部为 notAuth = true 时, 才会生效
    if (to.matched.some(r => !r.meta.notAuth)) {
        const token = db.get('token');
        if (token) {
            if (!store.state.user.token) {
                store.commit('user/setToken', token);
            }
            next();
        } else {
            console.warn('token 失效');
            next({ name: config.loginName });
        }
    } else {
        next();
    }
});

router.afterEach(to => {
    window.document.title = to.meta.title;
    window.scrollTo(0, 0);
});

export default router;
