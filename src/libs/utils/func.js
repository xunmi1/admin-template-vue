import { isFunction } from './type';
import { defineGet } from './object';

/**
 * 定时器
 * @param {Function} callback
 * @param {number} [wait]
 * @return {number}
 */
const useTimer = (callback, wait) => {
  let timerId;
  // eslint-disable-next-line
  const root = globalThis ?? self ?? window;
  // use requestAnimationFrame when wait is undefined
  const useRAF = wait == null && isFunction(root.requestAnimationFrame);

  const start = () => {
    if (useRAF) timerId = root.requestAnimationFrame(callback);
    else timerId = root.setTimeout(callback, wait ?? 0);
    return timerId;
  };

  useTimer.abort = () => {
    if (timerId == null) return;
    const stop = useRAF ? root.cancelAnimationFrame : root.clearTimeout;
    stop(timerId);
  };
  return start();
};

/**
 * 防抖
 * @param {Function} func the function to debounce
 * @param {number} [wait] milliseconds to delay
 * @return {Function} the new debounced function
 */
export function debounce(func, wait) {
  // `callTime`: save external call time
  let args, context, result, timerId, callTime;

  const abort = () => {
    useTimer.abort();
    args = context = callTime = timerId = undefined;
  };

  const canInvoke = () => {
    const timeDiff = Date.now() - callTime;
    return callTime === undefined || timeDiff >= (wait ?? 0) || timeDiff < 0;
  };

  // recalculate the waiting time by `callTime`
  const remainingWait = () => {
    if (wait == null) return;
    const interval = Date.now() - callTime;
    return wait - interval;
  };

  const invokeFunc = () => {
    const isInvoking = canInvoke();
    if (isInvoking) {
      timerId = undefined;
      if (args) result = func.apply(context, args);
      args = context = undefined;
      return;
    }

    // restart the time when triggered within the waiting time
    timerId = useTimer(invokeFunc, remainingWait());
  };

  function debounced(...rest) {
    args = rest;
    context = this;
    callTime = Date.now();

    if (timerId === undefined) {
      timerId = useTimer(invokeFunc, wait);
    }
    return result;
  }

  debounced.abort = abort;
  defineGet(debounced, 'pending', () => timerId != null);

  return debounced;
}

/**
 * 节流
 * @param {Function} func the function to throttle
 * @param {number} [wait] milliseconds to delay
 * @return {Function} the new throttled function
 */
export function throttle(func, wait) {
  // `invokeTime`: save internal execution time
  let invokeTime, args, context, result, timerId;

  const invokeFunc = () => {
    timerId = undefined;
    if (args) {
      invokeTime = Date.now();
      result = func.apply(context, args);
    }
    args = context = undefined;
  };

  // recalculate the waiting time by `invokeTime`
  const remainingWait = () => {
    if (wait == null) return;
    // run immediately when `invokeTime` is undefined
    if (invokeTime === undefined) return 0;
    const interval = Date.now() - invokeTime;
    return wait - interval;
  };

  const abort = () => {
    useTimer.abort();
    args = context = timerId = invokeTime = undefined;
  };

  function throttled(...rest) {
    args = rest;
    context = this;

    if (timerId === undefined) {
      timerId = useTimer(invokeFunc, remainingWait());
    }

    return result;
  }

  throttled.abort = abort;
  defineGet(throttled, 'pending', () => timerId != null);

  return throttled;
}

/**
 * 缓存(记忆)函数
 * @param {Function} func 需要缓存的函数
 * @param {Function} [transfer] 参数转换
 * @return {Function} 新函数
 */
export function cache(func, transfer) {
  const cacheMap = Object.create(null);
  return function cachedFn(...params) {
    const key = transfer ? transfer.apply(this, params) : String(params);
    const hit = cacheMap[key];
    return hit ?? (cacheMap[key] = func.apply(this, params));
  };
}

// 柯里化
export function curry(func) {
  const funcLength = func.length;

  return function curried(...args) {
    if (args.length < funcLength) {
      return function(...rest) {
        return curried.apply(null, args.concat(rest));
      };
    }
    return func.apply(null, args);
  };
}
