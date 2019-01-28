import service from '@/libs/service';

export function login (data, cancelToken) {
    if (data.userName && data.password) {
        return service.request({
            url: 'login',
            data: {
                username: data.userName,
                password: data.password
            },
            method: 'post',
            cancelToken,
        });
    } else{
        return Promise.reject('missing parameter');
    }
}

export function getPermissions (data) {
    if (data.userId) {
        return service.request({
            url: 'getPermissions',
            params: data
        });
    } else{
        return Promise.reject('missing parameter');
    }
}
