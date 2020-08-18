const error = new Error('next() should not be called multiple times in one middleware');

const compose = middleware => (context, next) => {
  let count = -1;
  const step = i => {
    if (i <= count) return Promise.reject(error);
    count = i;
    const func = middleware[i] ?? next;
    if (!func) return Promise.resolve();

    try {
      return Promise.resolve(func(context, () => step(i + 1)));
    } catch (err) {
      return Promise.reject(err);
    }
  };

  return step(0);
};

export default compose;
