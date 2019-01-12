export default [
    {
        path: '/user',
        name: 'user',
        redirect: '/user/login',
        meta: {
            notAuth: true,
            notCache: true
        },
        component: () => import(/* webpackChunkName: "UserLayout" */ '@/views/Layout/UserLayout'),
        children: [
            {
                path: 'login',
                name: 'login',
                alias: '/login',
                meta: {
                    title: '用户登录',
                    notAuth: true,
                    notCache: true
                },
                component: () => import(/* webpackChunkName: "Login" */ '@/views/User/Login'),
            }
        ]
    },
]
