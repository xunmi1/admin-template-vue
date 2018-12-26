export default [
    {
        path: '/login',
        name: 'Login',
        meta: {
            title: '登录',
            hideInBread: true,
            hideInMenu:  true,
            notAuth: true,
            notCache: true
        },
        component: () => import(/* webpackChunkName: "Login" */ '@/views/Login/Login'),
    },
]
