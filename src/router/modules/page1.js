export default [
    {
        path: 'BlankPage1',
        name: 'test1',
        meta: {
            title: '测试11',
            icon: 'pie-chart',
        },
        component: () => import(/* webpackChunkName: "BlankPage" */ '@/views/BlankPage/BlankPage'),
        children: [
            {
                path: 'Test1',
                name: 'Test1',
                meta: {
                    title: '测试11',
                    icon: 'credit-card'
                },
                component: () => import('@/views/BlankPage/Test1'),
            },
            {
                path: 'Test2',
                name: 'Test2',
                meta: {
                    title: '测试12',
                    icon: 'smile',
                },
                component: () => import('@/views/BlankPage/Test2'),
            }
        ]
    }
]
