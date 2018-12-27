export default [
    {
        path: 'BlankPage1',
        name: 'Home',
        meta: {
            title: '测试1',
            icon: 'pie-chart'
        },
        component: () => import(/* webpackChunkName: "BlankPage" */ '@/views/BlankPage/BlankPage'),
        children: [
            {
                path: 'BlankPage11',
                name: 'BlankPage11',
                meta: {
                    title: '测试11',
                    icon: 'credit-card'
                },
                component: () => import(/* webpackChunkName: "BlankPage" */ '@/views/BlankPage/BlankPage'),
                children: [
                    {
                        path: 'BlankPage111',
                        name: 'BlankPage111',
                        meta: {
                            title: '测试111',
                            icon: 'appstore'
                        },
                        component: () => import(/* webpackChunkName: "BlankPage" */ '@/views/BlankPage/BlankPage'),
                    },
                    {
                        path: 'BlankPage121',
                        name: 'BlankPage121',
                        meta: {
                            title: '测试121',
                            icon: 'credit-card'
                        },
                        component: () => import(/* webpackChunkName: "BlankPage" */ '@/views/BlankPage/BlankPage'),
                    }
                ]
            },
            {
                path: 'BlankPage12',
                name: 'BlankPage12',
                meta: {
                    title: '测试12',
                    hideInMenu: true,
                    icon: 'smile'
                },
                component: () => import(/* webpackChunkName: "BlankPage" */ '@/views/BlankPage/BlankPage'),
            },
            {
                path: 'BlankPage13',
                name: 'BlankPage13',
                meta: {
                    title: '测试13',
                    icon: 'inbox'
                },
                component: () => import(/* webpackChunkName: "BlankPage" */ '@/views/BlankPage/BlankPage'),
            }
        ]
    }
]
