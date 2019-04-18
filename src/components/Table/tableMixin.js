export default {
    props: {
        // 每行数据的唯一索引，同时用于选中判断
        rowKey: {
            type: [Function, String],
            required: true
        },
        // 是否不要序号列
        notNumber: Boolean,
        // 是否固定序号列, 前提是开启序号列
        isFixedNumber: {
            type: Boolean,
            default: false
        },
        // 是否阻止组件 created() 时自动请求数据
        notAuto: Boolean,
        // 是否开启内部分页
        isPaging: Boolean,
        // 表头
        columns: {
            type: Array,
            required: true,
            validator: value => value.every(i => (i.key || i.dataIndex) !== undefined)
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
            default: 'file'
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
                showTotal: total => `共 ${ total } 条`
            })
        },
        // 页码
        current: {
            type: Number,
            default: 1
        },
        // 分页大小
        pageSize: {
            type: Number,
            default: 10
        },
        // 选中项配置，不推荐使用（selectedKeys 和 select 事件会功能异常），可以使用 selectedKeys 代替
        selection: {
            type: [Object, Boolean],
            default: false
        },
        // 选中 row-key 的数组，需要 `.sync` 修饰符
        selectedKeys: Array,
        // 自定义数据转化函数，需要返回数据
        handler: {
            type: Function,
            default: data => data
        },
        // 强制更新数据，需要 `.sync` 修饰符
        isReload: Boolean
    },
    watch: {
        params: {
            handler (newVal, oldVal) {
                if (newVal && !equal(newVal, oldVal)) {
                    this.tableParams.current = 1;
                    this.total = 0;
                    this.setTableList();
                }
            },
            deep: true
        },
        current: {
            handler (newVal) {
                this.tableParams.current = Math.max(newVal, 1);
            },
            immediate: true
        },
        pageSize: {
            handler (newVal) {
                this.tableParams.pageSize = Math.max(newVal, 1);
            },
            immediate: true
        },
        isReload (newVal) {
            if (newVal) {
                this.setTableList();
            }
        }
    }
};

const equal = function (newVal, oldVal) {
    const [_newVal, _oldVal] = [JSON.stringify(newVal), JSON.stringify(oldVal)];
    return _newVal === _oldVal;
};
