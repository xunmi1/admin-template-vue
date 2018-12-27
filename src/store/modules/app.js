export default {
    namespaced: true,
    state: {
        errorList: []
    },
    mutations: {
        addError (state, error) {
            state.errorList.push(error);
        }
    },
    actions: {
        addErrorLog ({ commit, rootState }, info) {
            const { user: { userId, userName } } = rootState;
            commit('addError', {
                ...info,
                time: Date.now(),
                userId,
                userName
            });
        }
    }
};
