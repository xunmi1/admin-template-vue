import { uploadImg } from '@/api/file';

// 包裹富文本组件，默认提供 http 方法
export const wrappedEditor = function (component) {
    return {
        functional: true,
        render (h, context) {
            const prefix = `${context.parent.$app.dbPrefix}-tinyMCE-autosave-${(context.parent.$route.fullPath)}-`;
            const props = {
                http: uploadImg,
                autoSavePrefix: prefix,
                ...(context.data.props || {})
            };
            return h(component, { ...context.data, props}, context.children);
        }
    }
};
