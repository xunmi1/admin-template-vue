import http from '@/libs/http';

const mockUserInfo = {
  info: {
    id: 1,
    username: 'admin',
    password: 'admin-template',
    nickname: '管理员',
    avatar: 'admin',
    email: '',
  },
  access_token: 'TOKEN',
};

export function login(data) {
  if (data.username && data.password) {
    return Promise.resolve(mockUserInfo);
  } else {
    return Promise.reject('missing parameter');
  }
}

/**
 * 帐号退出
 */
export function logout() {
  return Promise.resolve({ msg: '已退出' });
}

export function getPermissions(params) {
  if (params.userId) {
    return http.get('getPermissions', { params });
  } else {
    return Promise.reject('missing parameter');
  }
}
