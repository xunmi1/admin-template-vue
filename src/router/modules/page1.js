import basicCard from '@/views/Container/BasicCard';

export default [
    {
        path: 'BlankPage1',
        name: 'page1',
        redirect: 'BlankPage1/Test1',
        meta: {
            title: '测试1',
            icon: 'pie-chart',
        },
        component: basicCard('Page11', true),
        children: [
            {
                path: 'Test1',
                name: 'Test11',
                meta: {
                    title: '测试11',
                    icon: 'credit-card'
                },
                component: () => import('@/views/BlankPage/Test1')
            },
            {
                path: 'Test2',
                name: 'Test12',
                meta: {
                    title: '测试12',
                    icon: 'smile',
                },
                component: () => import('@/views/BlankPage/Test2'),
            }
        ]
    }
]
