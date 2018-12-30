export default {
    namespaced: true,
    state: {
        layout: {
            menuTheme: 'dark',
            isVertical: true,
            isFixedHeader: true,
            isFixedSider: true
        },
        aliveList: [],
        errorList: []
    },
    mutations: {
        setLayout ({ layout }, data) {
            Object.keys(data).forEach(key => {
                layout[key] = data[key];
            });
        },
        initAliveList (state, data) {
            state.aliveList = Array.isArray(data) ? data : state.aliveList;
        },
        addAlive ({ aliveList }, pageName) {
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
