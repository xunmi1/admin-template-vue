import config from '@/config';

export default [
    {
        path: '/login',
        name: config.loginName,
        meta: {
            title: '用户登录',
            notAuth: true,
            notCache: true
        },
        component: () => import(/* webpackChunkName: "Login" */ '@/views/User/Login')
    }
];
