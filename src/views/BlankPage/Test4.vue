<template>
  <div>
    <h3>组件懒加载</h3>
    <VLazyComponent>
      <template>
        <VTagSelect v-model="value" :options="options" multiple />
        <VRichEditor />
      </template>
      <template #skeleton>
        <ASkeleton :paragraph="{ rows: 12 }" />
      </template>
    </VLazyComponent>
  </div>
</template>

<script>
export default {
  name: 'Test4',
  data() {
    return {
      value: [],
      options: [
        { label: '选项 1', value: 1 },
        { label: '选项 2', value: 2 },
      ],
    };
  },
};
</script>
