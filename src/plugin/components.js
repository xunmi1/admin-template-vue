import { wrappedEditor } from './proxyComponent';

export default {
    VMenu: () => import(/* webpackChunkName: "VMenu" */'@c/Menu/Menu'),
    VRichEditor: wrappedEditor(() => import(/* webpackChunkName: "VRichEditor" */'@c/Tinymce/Tinymce'))
};
