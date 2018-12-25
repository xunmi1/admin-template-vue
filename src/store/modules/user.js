import { login } from '@/api/user';
import { articles } from '@/api/news';
import service from '@/libs/service';

export default {
    namespaced: true,
    state: {
        userName: '',
        userId: '',
        token: ''
    },
    getters: {
        status: state => state.token ? 'online' : 'offline'
    },
    mutations: {
        setToken (state, token, time) {
            state.token = token;
            service.setToken(token);
            localStorage.token = JSON.stringify({
                value: token,
                time: time || Date.now()
            });
        },
    },
    actions: {
        handleLogin ({ commit }, { userName, password }) {
            userName = userName.trim();
            return login({ userName, password }).then(res => {
                commit('setToken', res.access_token);
                return Promise.resolve(res);
            }).then(articles);
        }
    }
};
