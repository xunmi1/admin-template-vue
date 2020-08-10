import config from '@/config';
import HttpClient from './HttpClient';
export { default as AbortRequest } from './AbortRequest';

const http = new HttpClient({ baseURL: config.baseURL });

http.use((ctx, next) => next().then(res => res.data));

export default http;
