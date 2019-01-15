export default [
    {
        path: 'Test',
        name: 'Test',
        params: {
            a:1
        },
        query: {
            b: 2
        },
        meta: {
            title: '测试33',
            icon: 'setting',
            // notCache: true
        },
        component: () => import(/* webpackChunkName: "Test" */ '@/views/BlankPage/Test'),
    }
]
