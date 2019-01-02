export default [
    {
        path: 'Test',
        alias: '/',
        name: 'Test',
        meta: {
            title: '测试33',
            icon: 'setting',
            // notCache: true
        },
        component: () => import(/* webpackChunkName: "Test" */ '@/views/BlankPage/Test'),
    }
]
