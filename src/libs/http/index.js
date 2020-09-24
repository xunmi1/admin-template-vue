import config from '@/config';
import HttpClient from './HttpClient';
import { returnMiddleware, noticeMiddleware } from './middleware';

export { default as AbortRequest } from './AbortRequest';

const http = new HttpClient({ baseURL: config.baseURL, withCredentials: true });

// Must always be first
http.use(returnMiddleware);
http.use(noticeMiddleware);

export default http;
