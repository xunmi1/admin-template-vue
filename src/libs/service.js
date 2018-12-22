import AxiosRequest from '@/libs/axios';
import config from '@/config';

const baseUrl = process.env.NODE_ENV !== 'production' ? config.baseUrl.dev : config.baseUrl.pro;

export default new AxiosRequest(baseUrl);
