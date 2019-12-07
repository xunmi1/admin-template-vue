import service from '@/libs/service';

const mockUserInfo = {
    info: {
        id: 1,
        username: 'admin',
        password: 'admin-template',
        nickname: '管理员',
        avatar: 'admin',
        email: '',
    },
    accessToken: 'TOKEN',
};

export function login (data) {
    if (data.username && data.password) {
        return Promise.resolve(mockUserInfo);
    } else {
        return Promise.reject('missing parameter');
    }
}

/**
 * 账号退出
 */
export function logout () {
    return Promise.resolve({ msg: '已退出' });
}

export function getPermissions (data) {
    if (data.userId) {
        return service.request({
            url: 'getPermissions',
            params: data,
        });
    } else {
        return Promise.reject('missing parameter');
    }
}
