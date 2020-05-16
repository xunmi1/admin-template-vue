export const toNumber = val => {
  const n = parseFloat(val);
  return isNaN(n) ? val : n;
};
