/**
 * 资讯
 */
import service from '@/libs/service';

const articles = function () {
    return service.request({
        url: 'articles',
        method: 'get'
    });
};

export {
    articles
};
