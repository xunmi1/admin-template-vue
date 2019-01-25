import { uploadImg } from '@/api/file';

// 包裹富文本组件，默认提供 http 方法
export const wrappedEditor = function (component) {
    return {
        functional: true,
        render (h, context) {
            const props = {http: uploadImg, ...(context.data.props || {})};
            return h(component, { ...context.data, props}, context.children);
        }
    }
};
