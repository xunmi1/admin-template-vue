export default {
  functional: true,
  props: {
    filterOption: {
      type: [Function, Boolean],
      default(input, option) {
        return option.componentOptions.children[0].text.toLowerCase().includes(input.toLowerCase());
      },
    },
    allowClear: {
      type: Boolean,
      default: true,
    },
  },
  render(h, context) {
    return h('ASelect', { ...context.data, props: context.props }, context.children);
  },
};
