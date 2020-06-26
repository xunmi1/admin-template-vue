<template>
  <div :class="{ expandable, expand: !isFold }" class="tag-select">
    <ACheckableTag v-if="!hideCheckAll" key="tag-select-all" :checked="checkAll" @change="changeAll">
      <span>全部</span>
    </ACheckableTag>
    <template v-for="option in options">
      <ACheckableTag :key="option.value" :checked="isSelect(option.value)" @change="change(option.value, $event)">
        <slot v-bind="option">
          <span>{{ option.label }}</span>
        </slot>
      </ACheckableTag>
    </template>
    <div v-if="expandable" class="tag-select-trigger" @click="changeFold">
      <a v-show="isFold">
        <span class="label">展开</span>
        <AIcon type="down" />
      </a>
      <a v-show="!isFold">
        <span class="label">收起</span>
        <AIcon type="up" />
      </a>
    </div>
  </div>
</template>

<script>
const isArray = Array.isArray;
const includes = (target, origin) => isArray(target) && origin.every(v => target.some(t => t === v));

export default {
  name: 'TagSelect',
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    value: [Array, Number, String, Boolean],
    expandable: Boolean,
    options: Array,
    multiple: Boolean,
    hideCheckAll: Boolean,
  },
  data() {
    return {
      isFold: true,
    };
  },
  computed: {
    valueList() {
      return this.options.map(v => v.value);
    },
    checkAll() {
      if (this.hideCheckAll) return;
      return this.multiple ? includes(this.value, this.valueList) : this.value == null;
    },
  },
  methods: {
    isSelect(value) {
      return this.multiple ? (isArray(this.value) ? this.value.includes(value) : false) : this.value === value;
    },
    change(value, checked) {
      if (this.multiple) this.changeMultiple(value, checked);
      else this.changeNotMultiple(value, checked);
    },
    changeMultiple(value, checked) {
      const _list = isArray(this.value) ? [...this.value] : [];
      if (checked) _list.push(value);
      else _list.splice(_list.indexOf(value), 1);
      this.$emit('change', _list);
    },
    changeNotMultiple(value, checked) {
      this.$emit('change', checked ? value : undefined);
    },
    changeAll(checked) {
      if (this.multiple) this.$emit('change', checked ? this.options.map(v => v.value) : []);
      else this.changeNotMultiple(this.value, !checked);
    },
    changeFold() {
      this.isFold = !this.isFold;
    },
  },
};
</script>

<style lang="less" scoped>
.tag-select {
  @spacing-bottom: 4px;

  overflow: hidden;
  line-height: unset;
  user-select: none;
  margin-bottom: -@spacing-bottom;

  /deep/ .ant-tag-checkable {
    font-size: 14px;
    line-height: 1.5;
    margin: 0 16px @spacing-bottom 0;
    padding: 0 8px;
    cursor: pointer;
  }

  &.expandable {
    position: relative;
    padding-right: 56px;
    max-height: 32px;
    transition: all 0.3s ease-in-out;
  }

  &.expand {
    max-height: 200px;
  }

  &-trigger {
    position: absolute;
    top: 0;
    right: 0;

    .label {
      margin-right: 4px;
    }
  }
}
</style>
