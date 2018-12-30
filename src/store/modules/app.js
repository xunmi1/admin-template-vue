export default {
    namespaced: true,
    state: {
        layout: {
            isVertical: true,
            isFixedHeader: true
        },
        aliveList: [],
        errorList: []
    },
    mutations: {
        setLayout ({ layout }, {
            isVertical = layout.isVertical,
            isFixedHeader = layout.isFixedHeader
        }) {
            layout.isVertical = isVertical;
            layout.isFixedHeader = isFixedHeader;
        },
        initAliveList (state, data) {
            state.aliveList = Array.isArray(data) ? data : state.aliveList;
        },
        addAlive ({ aliveList }, pageName) {
            console.log(aliveList);
            if (!aliveList.includes(pageName)) {
                aliveList.push(pageName);
            }
        },
        deleteAlive ({ aliveList }, pageName) {
            const index = aliveList.indexOf(pageName);
            aliveList.splice(index, 1);

        },
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
