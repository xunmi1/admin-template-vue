export default {
    namespaced: true,
    state: {
        layout: {
            menuTheme: 'dark',
            isVertical: true,
            isFixedHeader: true,
            isFixedSider: true,
            isMenuRight: true
        },
        aliveList: {},
        errorList: []
    },
    getters: {
        getAlive: ({aliveList}) => (page, name = 'default') => {
            if (aliveList[page] && Array.isArray(aliveList[page][name])) {
                console.log(aliveList[page][name]);
                return aliveList[page][name];
            } else {
                return [];
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
         * @param aliveList 全局缓存列表
         * @param page 拥有 <RouterView> 标签的组件，被引用到路由中，在路由中的 name，用于区分缓存列表
         * @param name 组件可以拥有多个 <RouterView> 时，需指定 name, 若只有一个，默认 'default'
         * @param alive 需要被缓存的组件，其自身的 name
         */
        addAlive ({ aliveList }, { page, name = 'default', alive }) {
            if (!aliveList[page]) {
                aliveList[page] = {};
            }
            if (!Array.isArray(aliveList[page][name])) {
                aliveList[page][name] = [];
            }
            if (!aliveList[page][name].includes(alive)) {
                aliveList[page][name].push(alive);
            }
        },
        clearAlive ({ aliveList }, { page, name = 'default', alive }) {
            if (aliveList[page] && Array.isArray(aliveList[page][name])) {
                const index = aliveList[page][name].indexOf(alive);
                if (index > -1) {
                    aliveList[page][name].splice(index, 1);
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
