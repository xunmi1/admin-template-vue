import { login, getPermissions } from '@/api/user';

import service from '@/libs/service';
import Db from '@/libs/db';
import config from '@/config';

const db = Db.getSingle(config.dbPrefix);

export default {
    namespaced: true,
    state: {
        userId: null,
        userName: '',
        token: '',
        avatar: '',
        nickName: ''
    },
    getters: {
        status: state => state.token ? 'online' : 'offline'
    },
    mutations: {
        setToken (state, { token, remember } = {}) {
            state.token = token;
            service.setToken(token);
            db.set('token', token, config.token.expires * 1000);
            db.set('remember', remember);
        },
        setUserInfo (state, userInfo) {
            Object.keys(userInfo).forEach(key => state[key] = userInfo[key]);
            db.set('userInfo', userInfo);
        }
    },
    actions: {
        handleLogin ({ commit }, { userName, password, remember }) {
            return login({ userName, password })
                .then(res => {
                    commit('setToken', {
                        token: res.access_token,
                        remember
                    });
                    const userInfo = {
                        userId: res.info.id,
                        avatar: res.info.avatar || res.info.nickname,
                        nickName: res.info.nickname,
                        userName: res.info.username,
                        email: res.info.email
                    };
                    commit('setUserInfo', userInfo);
                    return Promise.resolve(res);
                });
        },
        getPermissions ({ state }) {
            return getPermissions({ userId: state.userId })
                .then(res => {
                    return Promise.resolve(res);
                });
        }
    }
};
