import { notification } from 'ant-design-vue';
import { navigateToLogin } from '@/router';

/**
 * @param {HttpClientContext} ctx
 * @param {MiddlewareNext} next
 * @return {Promise<*>}
 */
export function handleResMiddleware(ctx, next) {
  return next()
    .then(() => ctx.data)
    .catch(() => Promise.reject(ctx.data));
}

const exceptionMap = new Map([
  [400, { message: '发出的请求有错误，服务器没有进行新建或修改数据的操作' }],
  [401, { message: '用户尚未认证授权', handler: navigateToLogin }],
  [403, { message: '用户已认证，但被禁止访问' }],
  [404, { message: '请求的资源不存在，服务器没有进行操作' }],
  [405, { message: '请求方法错误' }],
  [406, { message: '请求的资源格式错误' }],
  [408, { message: '请求超时' }],
  [410, { message: '请求的资源已被永久删除' }],
  [422, { message: '数据验证错误' }],
  [500, { message: '服务器发生错误，请检查服务器' }],
  [502, { message: '网关错误' }],
  [503, { message: '服务不可用，服务器暂时过载或维护' }],
  [504, { message: '网关超时' }],
]);

function noticeError(message, description) {
  Promise.resolve().then(() => notification.error({ message, description }));
}

/**
 * @param {HttpClientContext} ctx
 * @param {MiddlewareNext} next
 * @return {Promise<*>}
 */
export function noticeMiddleware(ctx, next) {
  return next().catch(error => {
    const status = ctx.status;
    if (status) {
      const exception = exceptionMap.get(status) ?? {};
      const errorText = exception.message ?? ctx.response.statusText;
      noticeError(`请求错误 ${status}: ${ctx.url}`, errorText);
      exception.handler?.(ctx);
    } else {
      noticeError('网络异常', '您的网络发生异常，无法连接服务器');
    }

    return Promise.reject(error);
  });
}
