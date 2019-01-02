export default [
    {
        path: 'BlankPage22',
        name: 'test2',
        meta: {
            title: '测试22',
            icon: 'pie-chart',
        },
        component: () => import(/* webpackChunkName: "BlankPage" */ '@/views/BlankPage/BlankPage'),
        children: [
            {
                path: 'Test333',
                name: 'Test333',
                meta: {
                    title: '测试3',
                    icon: 'credit-card'
                },
                component: () => import('@/views/BlankPage/Test3'),
            },
            {
                path: 'Test444',
                name: 'Test444',
                meta: {
                    title: '测试4',
                    icon: 'smile',
                },
                component: () => import('@/views/BlankPage/Test4'),
            }
        ]
    }
]
