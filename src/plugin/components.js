import { wrappedEditor, wrappedTable } from './wrapped';

export default {
    VMenu: () => import(/* webpackChunkName: "VMenu" */'@c/Menu/Menu'),
    VRichEditor: wrappedEditor(() => import(/* webpackChunkName: "VRichEditor" */'@c/Tinymce/Tinymce')),
    VLazyComponent: () => import(/* webpackChunkName: "VLazyComponent" */'@c/LazyComponent/LazyComponent'),
    VTable: wrappedTable(() => import(/* webpackChunkName: "VTable" */'@c/Table/Table')),
};
