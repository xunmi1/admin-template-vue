import { equal, hasOwn } from './utils';

export default {
  props: {
    // 每行数据的唯一索引，同时用于选中判断
    rowKey: {
      type: [Function, String],
      required: true,
    },
    // 序号列配置
    series: {
      type: [Boolean, Object],
      default: true,
    },
    // 是否阻止组件 created() 时自动请求数据
    lazy: Boolean,
    // 是否开启内部分页, 适用于接口不提供分页的情况，以减少不必要的数据请求
    isPaging: Boolean,
    // 表头
    columns: {
      type: Array,
      required: true,
      validator: value => value.every(i => (i.key || i.dataIndex) !== undefined),
    },
    // **获取数据的 http 方法**
    http: Function,
    // 表格数据，和 http 二选一， 注意: params 会失效,
    // 若需要筛选，可以配合 isReload 使用
    dataSource: Array,
    // 是否导出 xlsx
    isXlsx: Boolean,
    // 导出 xlsx 的方法
    xlsx: Function,
    // 文件名
    fileName: {
      type: String,
      default: 'file',
    },
    // 额外的查询参数对象
    params: Object,
    // 分页组件参数
    pagination: {
      type: [Object, Boolean],
      default: () => ({
        position: 'bottom',
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: total => `共 ${total} 条`,
      }),
    },
    // 页码
    current: {
      type: Number,
      default: 1,
    },
    // 分页大小
    pageSize: {
      type: Number,
      default: 10,
    },
    // 选中项配置, 不推荐使用，可以使用 selectedKeys 代替
    // Notes: `ATable` 的 `selectedRowKeys` 配置无效, 请使用 `selectedKeys`
    rowSelection: {
      type: Object,
      validator: val => {
        if (hasOwn(val, 'selectedRowKeys')) {
          // eslint-disable-next-line no-console
          console.error('[table]: `rowSelection.selectedRowKeys` is invalid, and use `selectedKeys`');
          return false;
        }
        return true;
      },
    },
    // 选中 row-key 的数组，需要 `.sync` 修饰符
    // 将自动开启选中行功能
    selectedKeys: Array,
    scroll: Object,
    // 自定义数据转化函数，需要返回数据
    handler: {
      type: Function,
      default: data => data,
    },
    // 强制更新数据，需要 `.sync` 修饰符
    isReload: Boolean,
  },
  watch: {
    params: {
      handler(newVal) {
        if (equal(newVal, this.cacheTableParams)) return;
        this.cacheTableParams = { ...newVal };
        this.updateForce();
        const { pageSize, filter, sorter } = this.tableParams;
        this.setTableParams({ current: 1, pageSize }, filter, sorter);
      },
      deep: true,
    },
    current: {
      handler(newVal) {
        this.tableParams.current = Math.max(newVal, 1);
      },
      immediate: true,
    },
    pageSize: {
      handler(newVal) {
        this.tableParams.pageSize = Math.max(newVal, 1);
      },
      immediate: true,
    },
    isReload(newVal) {
      if (newVal) {
        this.setTableList();
      }
    },
    dataSource() {
      this.updateForce();
      this.setTableList();
    },
  },
};
