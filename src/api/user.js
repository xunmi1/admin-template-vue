import service from '@/libs/service';

const login = function (data) {
    if (data.userName && data.password) {
        return service.request({
            url: 'login',
            data: {
                username: data.userName,
                password: data.password
            },
            method: 'post'
        });
    } else{
        return Promise.reject('missing parameter');
    }
};

export {
    login
};
