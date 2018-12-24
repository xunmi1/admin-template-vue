import { login } from '@/api/user';
import { articles } from '@/api/news';
import service from '@/libs/service';

export default {
    state: {
        userName: '',
        userId: '',
        token: ''
    },
    getters: {
        status: state => state.token ? 'online' : 'offline'
    },
    mutations: {
        setToken (state, token) {
            state.token = token;
        },
    },
    actions: {
        handleLogin ({ commit }, { userName, password }) {
            userName = userName.trim();
            return login({ userName, password }).then(res => {
                service.setToken(res.access_token);
                commit('setToken', res.access_token);
                return Promise.resolve(res);
            }).then(() => articles());
        }
    }
};
