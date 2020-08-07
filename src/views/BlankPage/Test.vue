<template>
  <ACard>
    <img v-preview-img src="https://cn.vuejs.org/images/logo.png" width="100" height="100" alt="logo" />
    <VTable
      :selected-keys.sync="selectedKeys"
      row-key="key"
      :columns="columns"
      :http="getTableData"
      :page-size="4"
      :current="2"
      is-xlsx
    >
      <template #name="{ value }">
        <ATag class="v-cell-tag">{{ value }}</ATag>
      </template>
    </VTable>
  </ACard>
</template>

<script>
/**
 * 表格组件使用例子
 * getTableData 的查询参数、返回值等格式由 /plugin/wrapped.js 模块中的表格组件包装函数控制
 */
import { getTableData } from '@/api/news';
import { delay } from '@/libs/utils';

export default {
  name: 'Test',
  data() {
    return {
      columns: [
        { title: 'Name', key: 'name' },
        { title: 'Age', key: 'age' },
        { title: 'Address', key: 'address' },
      ],
      selectedKeys: [],
    };
  },
  created() {
    delay(5000).then(() => this.selectedKeys.push('21', '13', '62', '23'));
  },
  methods: {
    getTableData,
  },
};
</script>
