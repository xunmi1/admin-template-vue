const basicCard = (...rest) => import('@/views/Container/BasicCard')
    .then(module => module.default(...rest));

export default [
    {
        path: 'blank-page2',
        name: 'Page2',
        meta: {
            title: '测试2',
            icon: 'pie-chart',
        },
        component: () => basicCard('Page22'),
        children: [
            {
                path: 'test21',
                name: 'Test21',
                meta: {
                    title: '测试21',
                    icon: 'credit-card',
                },
                component: () => import('@/views/BlankPage/Test3'),
            },
            {
                path: 'test22',
                name: 'Test22',
                meta: {
                    title: '测试22',
                    icon: 'smile',
                },
                component: () => import('@/views/BlankPage/Test4'),
            }
        ],
    }
];
