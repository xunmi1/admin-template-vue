const basicCard = (...rest) => import('@/views/Container/BasicCard')
    .then(module => module.default(...rest));

export default [
    {
        path: 'blank-page1',
        name: 'page1',
        redirect: { name: 'Test11' },
        meta: {
            title: '测试1',
            icon: 'pie-chart'
        },
        component: () => basicCard('Page11'),
        children: [
            {
                path: 'test11',
                name: 'Test11',
                meta: {
                    title: '测试11',
                    icon: 'credit-card'
                },
                component: () => import('@/views/BlankPage/Test1')
            },
            {
                path: 'test12',
                name: 'Test12',
                meta: {
                    title: '测试12',
                    icon: 'smile'
                },
                component: () => import('@/views/BlankPage/Test2')
            }
        ]
    }
];
