const FormRender = {
  functional: true,
  props: {
    tag: [String, Object, Function],
  },
  render(h, ctx) {
    const tag = ctx.props.tag;
    if (typeof tag === 'function') return tag(h, ctx);
    return h(tag, ctx.data, ctx.children);
  },
};

export default FormRender;
