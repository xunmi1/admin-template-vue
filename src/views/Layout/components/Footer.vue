<template functional>
  <section :class="{ placeholder: props.isFixed }">
    <ALayoutFooter
      :class="['footer', { 'footer-fixed': props.isFixed }]"
      :style="{ width: `calc(100% - ${props.isFixed ? props.offsetLeft : 0}px)` }"
    >
      <span>Copyright © </span>
      <span v-if="props.start != null">{{ props.start }} - </span>
      <span>{{ props.current }} </span>
      <span>{{ parent.$app.org }} All Rights Reserved.</span>
    </ALayoutFooter>
  </section>
</template>

<script>
export default {
  name: 'Footer',
  props: {
    isFixed: Boolean,
    width: {
      type: Number,
      default: 0,
    },
    start: Number,
    current: {
      type: Number,
      default: new Date().getFullYear(),
    },
  },
};
</script>

<style lang="less" scoped>
.placeholder::after {
  content: '';
  display: block;
  height: 28px;
}

.footer {
  text-align: center;
}

.footer-fixed {
  position: fixed;
  bottom: 0;
  padding: 8px 24px;
}
</style>
