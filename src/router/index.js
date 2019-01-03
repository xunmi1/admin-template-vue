import Vue from 'vue';
import NProgress from 'nprogress';
import config from '../config';
import Db from '../libs/db';
import store from '../store';
import Router from 'vue-router';

import others from './modules/others';
import page1 from './modules/page1';
import page2 from './modules/page2';
import page3 from './modules/page3';

NProgress.configure({ showSpinner: false });
Vue.use(Router);
/**
 * path: string               仅第一级路径 path 前面加 '/'
 * meta: {
 *    title: string           显示在侧边栏、面包屑和标签栏的文字
 *    hideInBread: (false)    true: 此级路由将不会出现在面包屑中
 *    hideInMenu: (false)     true: 在菜单不会显示该页面选项, **及其嵌套的子路由页面**
 *    notCache: (false)       true: 页面在切换标签后, **及其嵌套的子路由页面不会缓存**
 *    notAuth: (false)        true: 页面不需要验权，**若存在父级路由，所有父级路由也需设置 true，才能生效**
 *    icon: string            该页面在菜单、面包屑和标签导航处显示的图标
 * }
 */
const router = new Router({
    routes: [
        ...others,
        {
            // 默认: '/'
            path: config.mainPath,
            name: 'main',
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
const addAlive = function (to) {
    const length = to.matched.length;
    if (length > 1) {
        for (let i = length - 1; i > 0; i--) {
            const [own, parent] = [to.matched[i], to.matched[i - 1]];
            if (!(own.meta && own.meta.notCache)) {
                Object.keys(own.components).forEach(key => {
                    // 注意： 父级组件不支持多个 router-view
                    store.commit('app/addAlive', {
                        page: parent.components['default'].name,
                        type: key,
                        alive: own.components[key].name
                    });
                });
            }
        }
    }
    NProgress.done();
};

router.beforeEach((to, from, next) => {
    NProgress.start();
    // 如果前往路由的路由记录上有一个设置了验权 (!notAuth), 则进行 token 校验
    // matched 路由记录： 当前路由所在嵌套路径上，从顶层到本层的所有路由对象
    // 因此，类似于 'login' 等不验权的页面，需要其路由记录上，全部为 notAuth = true 时, 才会生效
    if (to.matched.some(r => !r.meta.notAuth)) {
        const token = db.get('token');
        if (token) {
            if (!store.state.user.token) {
                store.commit('user/setToken', token);
                store.commit('user/setUserInfo', db.get('userInfo'));
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
    Promise.resolve().then(() => {
        addAlive(to);
        NProgress.done();
    });
    window.document.title = to.meta.title || config.title.small;
    window.scrollTo(0, 0);
});

export default router;
