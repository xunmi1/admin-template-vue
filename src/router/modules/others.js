export default [
    {
        path: '/login',
        name: 'login',
        meta: {
            title: '登录',
            hideInBread: true,
            hideInMenu:  true,
            notAuth: true,
            notCache: true
        },
        component: () => import(/* webpackChunkName: "login" */ '@/views/Login/Login'),
    },
    {
        path: '/test',
        name: 'test',
        meta: {
            title: '测试'
        },
        component: () => import(/* webpackChunkName: "login" */ '@/views/Login/Login'),
    }
]
