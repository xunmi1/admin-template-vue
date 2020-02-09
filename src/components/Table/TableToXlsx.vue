<template functional>
  <ADropdown :disabled="props.loading" class="dropdown-pos">
    <AButton>
      <span>导出数据</span>
      <AIcon type="down" />
    </AButton>
    <template #overlay>
      <AMenu>
        <AMenuItem key="own" @click="listeners.export">当前页</AMenuItem>
        <template v-if="props.isSelection">
          <AMenuItem key="selected" @click="listeners['export-selected']">选中项</AMenuItem>
        </template>
        <AMenuItem key="all" @click="listeners['export-all']">全部</AMenuItem>
      </AMenu>
    </template>
  </ADropdown>
</template>

<script>
export default {
  name: 'TableXlsx',
  props: {
    loading: Boolean,
    isSelection: Boolean,
  },
};
</script>

<style scoped>
.dropdown-pos {
  position: absolute;
  bottom: 16px;
}
</style>
