<template>
  <AMenu v-bind="$attrs" v-on="$listeners">
    <template v-for="item of menuData">
      <AMenuItem v-if="!item.children" :key="item.key || item.name">
        <AIcon v-if="item.icon" :type="item.icon" />
        <span>{{ item.title }}</span>
      </AMenuItem>
      <SubMenu v-else :key="item.key || item.name" :item="item" />
    </template>
  </AMenu>
</template>

<script>
import SubMenu from './SubMenu';

export default {
  components: { SubMenu },
  model: {
    prop: 'selectedKeys',
    event: 'selectChange',
  },
  props: {
    menuData: {
      type: Array,
      required: true,
    },
  },
};
</script>
