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
        setToken (state, value) {
            state.token = value;
            service.setToken(value);
            db.set('token', value, config.token.expires * 1000);
        },
        setUserInfo (state, {avatar, nickname, username, email}) {
            state.avatar = avatar || nickname;
            state.nickName = nickname;
            state.userName = username;
            state.email = email;
            db.set('userInfo', {avatar, nickname, username, email});
        }
    },
    actions: {
        handleLogin ({ commit }, { userName, password }) {
            userName = userName.trim();
            return login({ userName, password }).then(res => {
                commit('setToken', res.access_token);
                commit('setUserInfo', res.info);
                return Promise.resolve(res);
            })
            // .then(articles);
        }
    }
};
