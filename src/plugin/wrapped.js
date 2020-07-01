import { upload } from '@/api/file';
import { toXlsx } from '@/libs/xlsx';
import config from '@/config';

// 包裹富文本组件，默认提供 http 方法
export const wrappedEditor = function (component) {
  const baseURL = process.env.BASE_URL + 'tinymce';
  const getAutoSavePrefix = path => `${config.dbPrefix}-tinyMCE-autosave-${path}-`;

  return {
    functional: true,
    props: {
      config: Object,
      http: {
        type: Function,
        default: upload,
      },
      baseURL: {
        type: String,
        default: baseURL,
      },
      documentURL: {
        type: String,
        default: config.assetsURL,
      },
    },
    render(h, context) {
      const { $route, $store } = context.parent;
      const props = {
        ...context.props,
        // 设置富文本所需的静态资源的基础 url
        autoSavePrefix: getAutoSavePrefix($route.fullPath),
        skin: $store.state.app.layout.menuTheme || 'light',
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
export const adapterOfList = function (service) {
  if (typeof service !== 'function') return service;
  return (params = {}) =>
    service(renamed(params))
      .catch(() => ({}))
      .then(transfer);
};

export const wrappedTable = function (component) {
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
