import { login } from '@/api/user';

import service from '@/libs/service';
import Db from '@/libs/db';
import config from '@/config';

const db = Db.getSingle();

export default {
    namespaced: true,
    state: {
        userName: '',
        token: '',
        avatar: '',
        nickName: ''
    },
    getters: {
        status: state => state.token ? 'online' : 'offline'
    },
    mutations: {
        setToken (state, {token, remember} = {}) {
            state.token = token;
            service.setToken(token);
            const expires = remember ? config.token.expires * 1000 : 0;
            db.set('token', token, expires);
        },
        setUserInfo (state, { avatar, nickname, username, email }) {
            state.avatar = avatar || nickname;
            state.nickName = nickname;
            state.userName = username;
            state.email = email;
            db.set('userInfo', { avatar, nickname, username, email });
        }
    },
    actions: {
        handleLogin ({ commit }, { userName, password, remember }) {
            return login({ userName, password }).then(res => {
                commit('setToken', {
                    token : res.access_token,
                    remember
                });
                commit('setUserInfo', res.info);
                return Promise.resolve(res);
            });
        }
    }
};
