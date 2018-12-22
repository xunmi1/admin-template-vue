import { login } from '@/api/user';

const user = {
    state: {
        userName: '',
        userId: '',
        token: ''
    },
    mutations: {
        setToken (state, token) {
            state.token = token;
        }
    },
    actions: {
        handleLogin ({ commit }, { userName, password }) {
            userName = userName.trim();
            return new Promise((resolve, reject) => {
                login({ userName, password }).then(res => {
                    commit('setToken', res.data.token);
                    resolve(res.data);
                }).catch(err => {
                    reject(err);
                });
            });
        }
    }
};

export default user;
