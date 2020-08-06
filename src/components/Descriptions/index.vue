<template>
  <ADescriptions :title="title" :bordered="bordered" :column="column" :size="size" :layout="layout" :colon="colon">
    <template v-for="field in fields">
      <ADescriptionsItem :key="field.key" :label="field.label || field.title" :span="getSpan(field.span)">
        <slot :name="field.key" v-bind="{ value: renderField(field) }">
          <div v-if="field.type === 'html'" class="descriptions-html" v-html="renderField(field)" />
          <div v-else>{{ renderField(field) }}</div>
        </slot>
      </ADescriptionsItem>
    </template>
  </ADescriptions>
</template>

<script>
export default {
  name: 'Descriptions',
  props: {
    title: String,
    bordered: Boolean,
    column: [Object, Number],
    size: String,
    layout: String,
    colon: {
      type: Boolean,
      default: true,
    },

    fields: {
      type: Array,
      default: () => [],
    },
    value: {
      type: Object,
      default: () => ({}),
    },
  },
  methods: {
    renderField({ key, customRender }) {
      const text = this.value[key];
      if (customRender) return customRender(text, key);
      return text;
    },
    getSpan(span) {
      return span ?? 1;
    },
  },
};
</script>

<style lang="less" scoped>
.descriptions-html {
  overflow: auto;

  /deep/ p {
    margin: 0;
  }
}
</style>
