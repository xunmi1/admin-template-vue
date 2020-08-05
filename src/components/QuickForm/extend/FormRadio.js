const RADIO_CHILDREN_BUTTON = 'ARadioButton';

export default {
  functional: true,
  props: {
    options: {
      type: Array,
      default: () => [],
    },
    // 子项可使用默认或 `button` 形式
    mode: {
      type: String,
      validator: value => ['default', 'button'].includes(value),
      default: 'default',
    },
  },
  // TODO: 使用 `ARadioGroup` 组件, 会引起全部组件绘制两次, 因此不建议使用 `ARadioGroup`
  render(h, context) {
    const { mode, options } = context.props;
    if (mode !== 'button') {
      return h('ARadioGroup', { ...context.data, props: { options } }, context.children);
    }
    const key = context.data.key;
    const children = options.map(v =>
      h(RADIO_CHILDREN_BUTTON, { props: v, key: `${key}-${v.value}` }, v.label || v.value)
    );
    return h('ARadioGroup', context.data, children);
  },
};
