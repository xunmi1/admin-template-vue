export default [
    {
        path: '/login',
        name: 'login',
        meta: {
            title: '登录',
            hideInBread: true,
            hideInMenu:  true,
            notCache: true
        },
        component: () => import(/* webpackChunkName: "login" */ '@/views/login/Login')
    }
]
