/**
 * 资讯
 */
import service from '@/libs/service';

const articles = function (params, cancelToken) {
    return service.request({
        url: 'articles',
        method: 'get',
        params,
        cancelToken
    });
};

export {
    articles
};
