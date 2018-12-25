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
        setToken (state, value, time = Date.now()) {
            state.token = value;
            service.setToken(value);
            localStorage.token = JSON.stringify({ value, time });
        }
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
