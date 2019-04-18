<template>
    <ACard>
        <VTable
            :selected-keys.sync="selectedKeys"
            row-key="key"
            :columns="columns"
            :data-source="data"
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
    const data = [
        { key: '1', name: 'John Brown', age: 32, address: 'New York No. 1 Lake Park' },
        { key: '2', name: 'Joe Black', age: 42, address: 'London No. 1 Lake Park' },
        { key: '3', name: 'Jim Green', age: 32, address: 'Sidney No. 1 Lake Park' },
        { key: '4', name: 'Jim Red', age: 32, address: 'London No. 2 Lake Park' }
    ];

    export default {
        name: 'Test',
        data () {
            return {
                data,
                columns: [
                    { title: 'Name', key: 'name' },
                    { title: 'Age', key: 'age' },
                    { title: 'Address', key: 'address' }
                ],
                selectedKeys: []
            };
        },
        created () {
            setTimeout(() => {
                this.selectedKeys.push('1', '3');
            }, 3000);
        }
    };
</script>

<style scoped>

</style>
