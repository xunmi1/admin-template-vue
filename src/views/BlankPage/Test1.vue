<template>
  <VRichEditor v-model="content" />
</template>

<script>
export default {
  name: 'Test1',
  data() {
    return {
      content: '12345',
    };
  },
};
</script>
