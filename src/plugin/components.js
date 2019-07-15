import { wrappedEditor, wrappedTable } from './wrapped';

export default {
    VRichEditor: wrappedEditor(() => import(/* webpackChunkName: "VRichEditor" */'@c/Tinymce/Tinymce')),
    VLazyComponent: () => import(/* webpackChunkName: "VLazyComponent" */'@c/LazyComponent/LazyComponent'),
    VTable: wrappedTable(() => import(/* webpackChunkName: "VTable" */'@c/Table/Table')),
};
