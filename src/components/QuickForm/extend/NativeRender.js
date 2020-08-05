import { TAG_DEFAULT } from '../constants';

export default {
  functional: true,
  props: {
    tag: {
      type: String,
      default: TAG_DEFAULT,
    },
    value: [Number, String, Array],
  },
  render(h, ctx) {
    const { tag, value } = ctx.props;
    const data = ctx.data;
    if (value == null) return;
    if (tag === 'select') {
      return h('span', data, getDisplayText(value, data.attrs));
    }
    if (tag === 'img') {
      const directives = value ? [{ name: 'zoomImg', value }] : [];
      if (data.attrs.listType === 'text') {
        return h('a', { ...data, directives }, '点击查看');
      }
      return h(tag, { ...data, attrs: value && { src: value }, directives });
    }
    if (tag === 'html') {
      return h(tag, { ...data, domProps: { innerHTML: value } });
    }
    return h(tag, data, value);
  },
};

const getDisplayText = function (value, attrs) {
  const { options = [], mode } = attrs;
  return mode === 'multiple' && Array.isArray(value)
    ? value
        .map(v => options.find(item => item.value === v))
        .filter(Boolean)
        .map(v => v.label)
        .join(', ')
    : (options.find(item => item.value === value) || {}).label;
};
