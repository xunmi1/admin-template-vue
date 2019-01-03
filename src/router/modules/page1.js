import BasicCard from '@/views/Container/BasicCard';

export default [
    {
        path: 'BlankPage1',
        name: 'Page1',
        meta: {
            title: '测试1',
            icon: 'pie-chart',
        },
        component: BasicCard('Page11', '测试1'),
        children: [
            {
                path: 'Test1',
                name: 'Test1111',
                meta: {
                    title: '测试11',
                    icon: 'credit-card'
                },
                component: () => import('@/views/BlankPage/Test1'),
            },
            {
                path: 'Test2',
                name: 'Test2222',
                meta: {
                    title: '测试12',
                    icon: 'smile',
                },
                component: () => import('@/views/BlankPage/Test2'),
            }
        ]
    }
]
