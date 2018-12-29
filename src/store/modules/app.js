export default {
    namespaced: true,
    state: {
        layout: {
            isVertical: true,
            isFixedHeader: true
        },
        errorList: []
    },
    mutations: {
        setLayout ({ layout }, { isVertical = layout.isVertical, isFixedHeader = layout.isFixedHeader }) {
            layout.isVertical = isVertical;
            layout.isFixedHeader = isFixedHeader;
        },
        addError ({ errorList }, error) {
            errorList.push(error);
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
