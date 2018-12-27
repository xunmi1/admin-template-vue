export default [
    {
        path: 'BlankPage3',
        name: 'BlankPage3',
        meta: {
            title: '测试3',
        },
        component: () => import(/* webpackChunkName: "BlankPage" */ '@/views/BlankPage/BlankPage'),
    }
]
