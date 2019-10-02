<template>
    <ACard>
        <VTable
            :selected-keys.sync="selectedKeys"
            row-key="key"
            :columns="columns"
            :http="getTableData"
            :page-size="3"
            :current="2"
            is-xlsx
        >
            <template #name="{value}">
                <ATag>{{ value }}</ATag>
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

    export default {
        name: 'Test',
        data () {
            return {
                columns: [
                    { title: 'Name', key: 'name' },
                    { title: 'Age', key: 'age' },
                    { title: 'Address', key: 'address' }
                ],
                selectedKeys: [],
            };
        },
        created () {
            setTimeout(() => this.selectedKeys.push('21', '13', '62'), 5000);
        },
        methods: {
            getTableData,
        },
    };
</script>
