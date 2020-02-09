import { upload } from '@/api/file';
import { toXlsx } from '@/libs/xlsx';

// 包裹富文本组件，默认提供 http 方法
export const wrappedEditor = function(component) {
  const baseURL = process.env.BASE_URL + 'tinymce';

  return {
    functional: true,
    render(h, context) {
      const parent = context.parent;
      const prefix = `${parent.$app.dbPrefix}-tinyMCE-autosave-${parent.$route.fullPath}-`;
      const props = {
        // 设置富文本所需的静态资源的基础 url
        baseURL,
        http: upload,
        autoSavePrefix: prefix,
        skin: parent.$store.state.app.layout.menuTheme || 'light',
        isMobile: parent.$store.getters['app/isMobileDevice'],
        ...context.props,
      };
      return h(component, { ...context.data, props }, context.children);
    },
  };
};

// 请求参数改名 current -> page,
const renamed = ({ current, ...rest }) => ({ page: current, ...rest });
// 修改请求响应体
const transfer = ({ data = [], meta = {} }) => ({ data, total: meta.total || data.length });
// 适配列表数据接口
export const adapterOfList = function(service) {
  if (typeof service !== 'function') return service;
  return (params = {}) =>
    service(renamed(params))
      .catch(() => ({}))
      .then(transfer);
};

export const wrappedTable = function(component) {
  return {
    functional: true,
    props: {
      http: Function,
      rowKey: {
        type: [String, Function],
        default: 'id',
      },
      scroll: {
        type: Object,
        default: () => ({}),
      },
    },
    render(h, context) {
      const [attrs, props, $store] = [context.data.attrs, context.props, context.parent.$store];
      const scroll = props.scroll;
      const isNarrow = $store.state.app.screenType.level < 6;
      const isMobile = $store.getters['app/isMobileDevice'];
      if (isNarrow) {
        attrs.size = 'middle';
        scroll.x = scroll.x || true;
      }
      if (isMobile) {
        attrs.size = 'small';
      }
      const options = {
        ...context.data,
        props: { http: adapterOfList(props.http), xlsx: toXlsx, rowKey: props.rowKey, scroll },
      };
      return h(component, options, context.children);
    },
  };
};
