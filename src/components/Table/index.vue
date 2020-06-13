<template>
  <div class="own-table">
    <ATable
      :columns="slotColumns"
      :data-source="tableData"
      :loading="loading"
      :pagination="pagination && { ...pagination, total, ...tableParams }"
      :row-key="rowKey"
      :row-selection="rowSelection"
      :scroll="scroll"
      v-bind="$attrs"
      @change="setTableParams"
      v-on="$listeners"
    >
      <template v-for="nativeSlot in nativeRenderKeys" #[nativeSlot]="attrs">
        <slot :name="nativeSlot" v-bind="attrs" />
      </template>
      <template v-for="columnSlot in customRenderKeys" #[columnSlot]="text, record, index">
        <slot :name="columnSlot" v-bind="{ row: record, index, value: text }">
          <span :key="`${columnSlot}-${index}`">{{ text }}</span>
        </slot>
      </template>
    </ATable>
    <template v-if="isXlsx && typeof xlsx === 'function' && !loading">
      <TableToXlsx
        :is-selection="!!rowSelection"
        :loading="loading"
        @export="exportCurrent"
        @export-all="exportAllXlsx()"
        @export-selected="exportSelected"
      />
    </template>
  </div>
</template>

<script>
import tableMixin from './tableMixin';
import { equal, slice, getPropWith } from './utils';

const SLOT_SERIAL_NUMBER = '__SLOT_SERIAL_NUMBER__';
const NATIVE_SLOTS = ['title', 'expandedRowRender', 'expandIcon', 'footer'];
const BAN_SLOTS = NATIVE_SLOTS.concat(SLOT_SERIAL_NUMBER);

export default {
  name: 'VTable',
  components: {
    TableToXlsx: () => import(/* webpackChunkName: "TableToXlsx" */ './TableToXlsx'),
  },
  mixins: [tableMixin],
  data() {
    return {
      // 内部参数对象
      tableParams: {
        current: 1,
        pageSize: 10,
      },
      total: 0,
      selectedData: [],
      tableData: [],
      loading: true,
    };
  },
  computed: {
    slotColumns() {
      return proxyColumns(this);
    },
    customRenderKeys() {
      const keys = this.slotColumns.map(v => v.scopedSlots.customRender).filter(v => this.$scopedSlots[v]);
      return warn(keys), keys;
    },
    nativeRenderKeys() {
      return BAN_SLOTS.filter(v => this.$scopedSlots[v]);
    },
    rowSelection() {
      if (!(this.selection || this.selectedKeys)) return null;
      return {
        fixed: true,
        selectedRowKeys: this.selectedKeys,
        onChange: this.onSelectChange,
        // 如果有 'select' 事件，再绑定相应事件（很耗性能）
        onSelect: this.needSelectAction && this.selectOneHandler,
        onSelectAll: this.needSelectAction && this.selectAllHandler,
        ...(this.selection || {}),
      };
    },
    isCompleteData() {
      // 不需要分页 | 开启内部分页 | 本地数据
      return !this.pagination || this.isPaging || Array.isArray(this.dataSource);
    },
  },
  beforeCreate() {
    // 开启表格选中时，选中发生切换的 rows 和 选中类型（增加|移除）
    this.changeRows = [];
    this.selected = false;
    // 缓存旧的查询参数对象
    this.cacheTableParams = {};
  },
  created() {
    // 是否有 `select` 事件（前提是已绑定 selectedKeys）或 导出功能
    this.needSelectAction = !!((Array.isArray(this.selectedKeys) && this.$listeners.select) || this.isXlsx);
    if (!this.lazy) this.setTableList();
    if (!this.needSelectAction) {
      this.$watch('selectedKeys', newVal => {
        this.selectedData = this.selectedData.filter(item => newVal.includes(getPropWith(this.rowKey, item)));
        this.$emit('select', this.selectedData, this.changeRows, this.selected);
      });
    }
  },
  methods: {
    setTableParams({ current, pageSize }, filter, sorter) {
      if (this.tableParams.current !== current || this.tableParams.current !== pageSize) {
        this.$emit('change-params', { current, pageSize });
      }
      if (!equal(this.tableParams.filter, filter)) {
        this.updateForce();
        this.$emit('change-filter', filter);
      }
      if (!equal(this.tableParams.sorter, sorter)) {
        this.updateForce();
        this.$emit('change-sorter', sorter);
      }
      this.tableParams = { current, pageSize, filter, sorter };
      this.setTableList();
    },
    // 强制更新数据
    updateForce() {
      this.total = 0;
    },
    async setTableList() {
      this.loading = true;
      // 如果完整数据
      if (this.isCompleteData) {
        // 如果总条数为 0 或强制更新数据，则重新拉取数据
        if (!this.total || this.isReload) {
          const { filter, sorter } = this.tableParams;
          const res = await this.getData({ filter, sorter, ...this.params });
          [this.total, this.tableData] = [res.total, res.data];
        }
        this.$emit('change', slice(this.tableData, this.tableParams));
      } else {
        const res = await this.getData({ ...this.tableParams, ...this.params });
        [this.total, this.tableData] = [res.total, res.data];
        this.$emit('change', this.tableData);
      }
      // 如果页码 > 1 且 表格数据为空，则回退到上一页
      if (this.tableParams.current > 1 && !this.tableData.length) {
        this.tableParams.current -= 1;
        this.setTableList();
        return;
      }
      // 通知已经刷新
      if (this.isReload) this.$emit('update:is-reload', false);
      this.loading = false;
    },
    // 获取数据，包括本地数据、不分页请求、分页请求
    async getData(params) {
      if (Array.isArray(this.dataSource)) {
        const data = this.handler(this.dataSource);
        return { data, total: data.length };
      }
      let res = {};
      try {
        res = await this.http(params);
        res.data = this.handler(res.data);
      } catch (err) {
        res = { data: [], total: 0 };
        if (process.env.NODE_ENV !== 'production') throw err;
      }
      return res;
    },
    onSelectChange(selectedRowKeys) {
      this.$emit('update:selected-keys', selectedRowKeys);
    },
    // 选择/取消选择所有列
    selectAllHandler(selected, selectedRows, changeRows) {
      changeRows.forEach(record => this.changeSelection(record, selected));
      [this.changeRows, this.selected] = [changeRows, selected];
    },
    // 选择/取消选择某一列
    selectOneHandler(record, selected) {
      this.changeSelection(record, selected);
      [this.changeRows, this.selected] = [[record], selected];
    },
    changeSelection(record, selected) {
      const key = getPropWith(this.rowKey, record);
      const _index = this.selectedData.findIndex(item => getPropWith(this.rowKey, item) === key);
      if (selected) {
        if (_index < 0) this.selectedData.push(record);
      } else {
        if (_index > -1) {
          this.selectedData.splice(_index, 1);
          this.changeSelection(record, false);
        }
      }
    },
    exportCurrent() {
      this.exportXlsx(this.isCompleteData ? slice(this.tableData, this.tableParams) : this.tableData);
    },
    exportSelected() {
      this.exportXlsx(this.selectedData);
    },
    async exportAllXlsx(num = 1) {
      try {
        let data = [];
        const params = { current: num, pageSize: 500 };
        if (!this.pagination || this.isPaging || Array.isArray(this.dataSource)) {
          data = slice(this.tableData, params);
        } else if (this.http) {
          data = (await this.getData({ ...params, ...this.params })).data;
        }
        this.exportXlsx(data, this.fileName + num);
        if (data.length < 500) return;
        await this.exportAllXlsx(num + 1);
      } catch (e) {
        this.$emit('export-error', e);
      }
    },
    exportXlsx(dataSource, fileName = this.fileName) {
      this.xlsx({
        dataSource,
        fileName,
        columns: this.columns.filter(v => filterColumn(v, 'xlsx')),
      });
    },
  },
};

const proxyColumns = function({ columns, series, tableParams: { current, pageSize } }) {
  const _columns = columns.filter(v => filterColumn(v, 'table')).map(initColumn);
  const serialKey = SLOT_SERIAL_NUMBER;
  if (series && _columns.length && _columns[0].key !== (series.key ?? serialKey)) {
    const serialColumn = {
      key: serialKey,
      title: '序号',
      width: 68,
      customRender: getSerialRender(current, pageSize),
      ...series,
    };
    _columns.unshift(initColumn(serialColumn));
  }
  return _columns;
};

const filterColumn = function({ visible = true }, type) {
  return visible === true || visible === type;
};

const initColumn = function(column) {
  const { key, dataIndex, scopedSlots, ...rest } = column;
  return {
    key: key ?? dataIndex,
    dataIndex: dataIndex ?? key,
    scopedSlots: scopedSlots ?? { customRender: dataIndex ?? key },
    ...rest,
  };
};

const getSerialRender = function(current, pageSize) {
  return (text, record, index) => (current - 1) * pageSize + index + 1;
};

const warn = (function() {
  if (process.env.NODE_ENV === 'production') return () => true;
  const generate = slot =>
    `The key '${slot}' have been banned, and you can set the new key with 'scopedSlots' or 'dataIndex'.`;
  return keys => {
    // eslint-disable-next-line no-console
    BAN_SLOTS.forEach(slot => keys.includes(slot) && console.error(generate(slot)));
  };
})();
</script>

<style lang="less" scoped>
.own-table {
  position: relative;

  /deep/ .ant-table {
    .ant-table-thead > tr > th,
    .ant-table-row > td {
      @media screen {
        @media (max-width: 768px) {
          white-space: nowrap;
        }
        @media (max-width: 992px) {
          word-break: keep-all;
        }
      }
    }
  }
}
</style>
