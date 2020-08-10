export default function compose(middlewares) {
  return (context, next) => {
    let index = -1;
    const dispatch = i => {
      if (i <= index) {
        return Promise.reject(new Error('next() should not be called multiple times in one middleware'));
      }
      index = i;
      const fn = middlewares[i] ?? next;
      if (!fn) return Promise.resolve();
      try {
        return Promise.resolve(fn(context, () => dispatch(i + 1)));
      } catch (err) {
        return Promise.reject(err);
      }
    };

    return dispatch(0);
  };
}
