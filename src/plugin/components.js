import { wrappedEditor, wrappedTable } from './proxyComponent';

export default {
    VMenu: () => import(/* webpackChunkName: "VMenu" */'@c/Menu/Menu'),
    VRichEditor: wrappedEditor(() => import(/* webpackChunkName: "VRichEditor" */'@c/Tinymce/Tinymce')),
    VLazyComponent: () => import(/* webpackChunkName: "VLazyComponent" */'@c/LazyComponent/LazyComponent'),
    VTable: wrappedTable(() => import(/* webpackChunkName: "VTable" */'@c/Table/Table')),
};
