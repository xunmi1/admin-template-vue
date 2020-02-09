export default [
  {
    path: 'test33',
    name: 'Test33',
    meta: {
      title: '测试33',
      icon: 'setting',
    },
    component: () => import(/* webpackChunkName: "Test" */ '@/views/BlankPage/Test'),
  },
];
