<template>
  <ACascader
    :value="ownValue"
    :field-names="ownFieldNames"
    :change-on-select="changeOnSelect"
    :placeholder="placeholder"
    :show-search="showSearch"
    v-bind="$attrs"
    @change="change"
    @popupVisibleChange="popupVisibleChange"
  />
</template>

<script>
const filter = function (inputValue, path) {
  return path.some(option => option.label.toLowerCase().includes(inputValue.toLowerCase()));
};
export default {
  name: 'FormCascader',
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    // 是否为原生的 ant 组件
    // true: 完整的数据路径及值
    // false: value 及 change 事件传递的值为叶节点的值，
    isNative: {
      type: Boolean,
      default: true,
    },
    value: [Number, String, Array],
    changeOnSelect: {
      type: Boolean,
      default: true,
    },
    showSearch: {
      type: Object,
      default: () => ({ filter }),
    },
    fieldNames: {
      type: Object,
      default: () => ({}),
    },
    placeholder: {
      type: String,
      default: '',
    },
  },
  computed: {
    ownValue() {
      if (this.isNative || Array.isArray(this.value)) return this.value;
      const path = [];
      findPath(this.$attrs.options, this.value, path, this.ownFieldNames);
      return path;
    },
    ownFieldNames() {
      return Object.assign({}, { label: 'label', value: 'value', children: 'children' }, this.fieldNames);
    },
  },
  methods: {
    change(path, data) {
      if (this.isNative) this.$emit('change', path, data);
      else {
        const lastIndex = path.length - 1;
        this.$emit('change', path[lastIndex], data[lastIndex]);
      }
    },
    popupVisibleChange(value) {
      this.$emit('popup-visible-change', value);
    },
  },
};
const findPath = function (data = [], id, path, { value, children }) {
  return data.some(item => {
    path.push(item[value]);
    if (item[value] === id || findPath(item[children], id, path, { value, children })) return true;
    path.pop();
    return false;
  });
};
</script>
