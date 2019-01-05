export default [
    {
        path: '/login',
        name: 'login',
        meta: {
            title: '登录',
            notAuth: true,
            notCache: true
        },
        component: () => import(/* webpackChunkName: "Login" */ '@/views/Login/Login'),
    },
]
