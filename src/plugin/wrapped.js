import { upload } from '@/api/file';
import { toXlsx } from '@/libs/xlsx';

// 包裹富文本组件，默认提供 http 方法
export const wrappedEditor = function (component) {
    return {
        functional: true,
        render (h, context) {
            const prefix = `${ context.parent.$app.dbPrefix }-tinyMCE-autosave-${ context.parent.$route.fullPath }-`;
            const store = context.parent.$store;
            const props = {
                // 设置富文本所需的静态资源的基础 url
                baseURL: process.env.BASE_URL + 'tinymce',
                http: upload,
                autoSavePrefix: prefix,
                skin: store.state.app.layout.menuTheme || 'light',
                isMobile: store.getters['app/isMobileDevice'],
                ...context.props
            };
            return h(component, { ...context.data, props }, context.children);
        }
    };
};

export const wrappedTable = function (component) {
    // 适配接口参数要求
    // 例如参数改名 current -> page
    const renamed = ({ current, ...rest }) => ({ page: current, ...rest });
    const proxyService = function (service) {
        if (typeof service === 'function') {
            return (params = {}) => service(renamed(params))
                .then(({ data = [], meta = {} }) => ({
                    data,
                    total: meta.total || data.length
                }));
        }
    };
    return {
        functional: true,
        render (h, context) {
            const [attrs, $store] = [context.data.attrs, context.parent.$store];
            const isNarrow = $store.state.app.screenType.level < 6;
            const isMobile = $store.getters['app/isMobileDevice'];
            if (isNarrow) {
                attrs.size = 'middle';
            }
            if (isMobile) {
                attrs.size = 'small';
                attrs.scroll = { x: true, ...(attrs.scroll || {}) };
            }
            return h(component, {
                ...context.data,
                props: {
                    http: proxyService(context.props.http),
                    xlsx: toXlsx,
                    rowKey: context.props.rowKey || 'id'
                }
            }, context.children);
        }
    };
};
