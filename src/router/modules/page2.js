export default [
    {
        path: 'BlankPage2',
        name: 'BlankPage2',
        meta: {
            title: '测试2',
            icon: 'setting'
        },
        component: () => import(/* webpackChunkName: "BlankPage" */ '@/views/BlankPage/BlankPage'),
    }
]
