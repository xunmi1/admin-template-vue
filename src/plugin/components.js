import { wrappedEditor, wrappedTable } from './wrapped';

export default {
  VRichEditor: wrappedEditor(() => import(/* webpackChunkName: "VRichEditor" */ '@c/Tinymce')),
  VLazyComponent: () => import(/* webpackChunkName: "VLazyComponent" */ '@c/LazyComponent'),
  VTable: wrappedTable(() => import(/* webpackChunkName: "VTable" */ '@c/Table')),
  VTagSelect: wrappedTable(() => import(/* webpackChunkName: "VTagSelect" */ '@c/TagSelect')),
  VQuickForm: wrappedTable(() => import(/* webpackChunkName: "VQuickForm" */ '@c/QuickForm')),
};
