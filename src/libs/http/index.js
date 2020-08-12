import config from '@/config';
import HttpClient from './HttpClient';
import { handleResMiddleware, exceptionMiddleware } from './middlewares';

export { default as AbortRequest } from './AbortRequest';

const http = new HttpClient({ baseURL: config.baseURL, withCredentials: true });

http.use(handleResMiddleware);
http.use(exceptionMiddleware);

export default http;
