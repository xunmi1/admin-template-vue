export default {
    namespaced: true,
    state: {
        layout: {
            menuTheme: 'dark',
            isVertical: true,
            isFixedHeader: true,
            isFixedSider: true,
            isMenuRight: true,
            theme: 'daybreak-blue',
        },
        themeList: [
            { text: '金盏花', name: 'alendula-gold', color: '#faad14' },
            { text: '极光绿', name: 'polar-green', color: '#52C41A' },
            { text: '明青', name: 'cyan', color: '#13C2C2' },
            { text: '拂晓蓝', name: 'daybreak-blue', color: '#1890FF' },
            { text: '酱紫', name: 'golden-purple', color: '#722ED1' },
        ],
        aliveList: {},
        errorList: []
    },
    getters: {
        getAlive: ({ aliveList }) => (page, name = 'default') => {
            if (aliveList[page] && Array.isArray(aliveList[page][name])) {
                return aliveList[page][name];
            } else {
                return null;
            }
        }
    },
    mutations: {
        setLayout ({ layout }, data) {
            Object.keys(data).forEach(key => {
                layout[key] = data[key];
            });
        },
        /**
         * 添加页面缓存
         * @param state 全局状态
         * @param page 拥有 <RouterView> 标签的组件，被引用到路由中，在路由中的 name，用于区分缓存列表
         * @param name 组件可以拥有多个 <RouterView> 时，需指定 name, 若只有一个，默认 'default'
         * @param alive 需要被缓存的组件，其自身的 name
         */
        addAlive (state, { page, name = 'default', alive }) {
            if (!state.aliveList[page]) {
                state.aliveList = { ...state.aliveList, [page]: { [name]: [alive] } };
                return;
            }
            if (!Array.isArray(state.aliveList[page][name])) {
                state.aliveList[page] = { ...state.aliveList[page], [name]: [alive] };
                return;
            }
            if (!state.aliveList[page][name].includes(alive)) {
                state.aliveList[page][name].push(alive);
            }
        },
        clearAlive (state, { page, name = 'default', alive }) {
            if (state.aliveList[page] && Array.isArray(state.aliveList[page][name])) {
                const index = state.aliveList[page][name].indexOf(alive);
                if (index > -1) {
                    state.aliveList[page][name].splice(index, 1);
                }
            }
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
