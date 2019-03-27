<template>
    <div style="position: relative">
        <ATable
            :row-selection="rowSelection"
            :row-key="rowKey"
            :pagination="pagination && { ...pagination, total, ...tableParams}"
            :columns="slotColumns"
            :loading="loading"
            :data-source="tableData"
            @change="setTableParams"
            v-bind="$attrs"
            v-on="$listeners"
        >
            <template
                v-for="column in slotColumns"
                #[column.scopedSlots.customRender]="text, record, index"
            >
                <slot
                    :name="column.scopedSlots.customRender"
                    v-bind="{ row: record, column, index, value: text }"
                >
                    <span :key="column.dataIndex + index" class="table-cell">{{ text }}</span>
                </slot>
            </template>
        </ATable>
        <TableToXlsx
            v-if="isXlsx && typeof xlsx === 'function' && !loading"
            :is-selection="!!selection"
            :loading="loading"
            @export="exportXlsx(tableData)"
            @export-selected="exportXlsx(selectedData)"
            @export-all="exportAllXlsx()"
        />
    </div>
</template>

<script>
    import tableMixin from './tableMixin';

    export default {
        name: 'VTable',
        components: {
            TableToXlsx: () => import(/* webpackChunkName: "TableXlsx" */'./TableToXlsx')
        },
        mixins: [tableMixin],
        data () {
            return {
                tableParams: {
                    current: 1,
                    pageSize: 10
                },
                total: 0,
                selectedData: [],
                tableData: [],
                loading: true
            };
        },
        computed: {
            slotColumns () {
                return proxyColumns(this);
            },
            rowSelection () {
                if (!this.selection) return null;
                const defaultSelection = {
                    fixed: true,
                    selectedRowKeys: this.selectAllKeys,
                    onSelect: this.selectOneHandler,
                    onSelectAll: this.selectAllHandler
                };
                return typeof this.selection === 'object'
                    ? { ...defaultSelection, ...this.selection }
                    : defaultSelection;
            },
            selectAllKeys () {
                return this.selectedData.map(item => toPath(item, this.rowKey));
            }
        },

        created () {
            if (!this.notAuto) this.setTableList();
        },
        methods: {
            setTableParams ({ current, pageSize }) {
                this.tableParams = { current, pageSize };
                this.$emit('change-params', { current, pageSize });
                this.setTableList();
            },
            async setTableList () {
                this.loading = true;
                // 如果内部分页或者是本地数据
                if (this.isPaging || Array.isArray(this.dataSource)) {
                    // 如果总条数为 0 或强制更新数据，则重新拉取数据
                    if (!this.total || this.isReload) {
                        const res = await this.getData(this.params);
                        [this.total, this.tableData] = [res.total, res.data];
                    }
                    this.$emit('change', sliceData(this.tableData, this.tableParams));
                } else {
                    const res = await this.getData({ ...this.tableParams, ...this.params });
                    [this.total, this.tableData] = [res.total, res.data];
                    this.$emit('change', this.tableData);
                }
                // 通知已经刷新
                if (this.isReload) this.$emit('update:is-reload', false);
                this.loading = false;
            },
            // 获取数据，包括本地数据、不分页请求、分页请求
            async getData (params) {
                if (Array.isArray(this.dataSource)) {
                    const data = this.handler(this.dataSource);
                    return { data, total: data.length };
                }
                let res = {};
                try {
                    res = await this.http(params);
                    res.data = this.handler(res.data);
                } catch {
                    res = { data: [], total: 0 };
                }
                return res;
            },

            // 选择/取消选择所有列
            selectAllHandler (selected, selectedRows, changeRows) {
                changeRows.forEach(record => this.changeSelection(record, selected));
                this.$emit('select', this.selectedData, changeRows, selected);
            },
            // 选择/取消选择某一列
            selectOneHandler (record, selected) {
                this.changeSelection(record, selected);
                this.$emit('select', this.selectedData, [record], selected);
            },
            changeSelection (record, selected) {
                const key = toPath(record, this.rowKey);
                const _index = this.selectedData.findIndex(item => toPath(item, this.rowKey) === key);
                if (selected) {
                    if (_index < 0) this.selectedData.push(record);
                } else {
                    if (_index > -1) {
                        this.selectedData.splice(_index, 1);
                        this.changeSelection(record, false);
                    }
                }
            },
            exportXlsx (dataSource, fileName = this.fileName) {
                this.xlsx({
                    dataSource,
                    columns: this.columns,
                    fileName
                });
            },
            async exportAllXlsx (num = 1) {
                try {
                    let data = [];
                    const params = { current: num, pageSize: 500 };
                    if (this.isPaging || Array.isArray(this.dataSource)) {
                        data = sliceData(this.tableData, params);
                    } else if (this.http) {
                        data = (await this.getData({
                            ...params,
                            ...this.params
                        })).data;
                    }
                    this.exportXlsx(data, this.fileName + num);
                    if (data.length < 500) return;
                    await this.exportAllXlsx(num + 1);
                } catch {
                    this.$message.error('导出失败！');
                }
            }
        }
    };

    const proxyColumns = function ({ columns, notNumber, isFixedNumber, tableParams: { current, pageSize } }) {
        const _columns = columns.map(item => ({
            key: item.scopedSlots ? (item.key || item.dataIndex) : warn(item.key || item.dataIndex),
            fixed: isFixedNumber,
            dataIndex: item.dataIndex || item.key,
            scopedSlots: { customRender: item.dataIndex || item.key },
            ...item
        }));
        if (!notNumber && (_columns.length && _columns[0].type !== 'index')) {
            _columns.unshift({
                type: 'index',
                title: '序号',
                width: 68,
                customRender: (text, record, index) => ((current - 1) * pageSize) + index + 1,
                scopedSlots: { customRender: 'index' }
            });
        }
        return _columns;
    };
    // 截取数据
    const sliceData = function (data, { current, pageSize }) {
        const start = (current - 1) * pageSize;
        return data.slice(start, start + pageSize);
    };
    const toPath = function (data, path) {
        if (typeof path === 'string') {
            return path.split('.').reduce((total, value) => total[value], data);
        }
        if (typeof path === 'function') {
            return path(data);
        }
        return data;
    };
    const BAN_SLOTS = ['index', 'title', 'expandedRowRender', 'expandIcon', 'footer'];
    const warn = function (name) {
        if (process.env.NODE_ENV !== 'production') {
            if (BAN_SLOTS.includes(name)) {
                console.error(`The key '${ name }' is banned, and you need to use the other key!`);
            }
        }
        return name;
    };
</script>

<style scoped>
    .table-cell {
        display: inline-block;
        min-width: 72px;
    }
</style>
