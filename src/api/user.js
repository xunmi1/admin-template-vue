import service from '@/libs/service';

const login = data => {
    if (data.userName && data.password) {
        return service.request({
            url: 'login',
            data,
            method: 'post'
        })
    } else{
        return Promise.reject();
    }
};

export {
    login
};
