export default {
  namespaced: true,
  state: {
    layout: {
      menuTheme: 'dark',
      isVertical: true,
      isFixedHeader: true,
      isFixedSider: true,
      isMenuRight: false,
      theme: 'daybreak-blue',
    },
    screenType: {
      type: 'xl',
      level: 6,
    },
    constrainedBox: {
      mainOffsetLeft: 0,
    },
    aliveList: {},
    errorList: [],
  },
  getters: {
    getAlive: ({ aliveList }) => (page, name = 'default') => {
      const map = aliveList[page];
      if (map) {
        const list = map[name];
        if (Array.isArray(list)) return list;
      }
      return [];
    },
    isMobileDevice: ({ screenType }) => screenType.level < 3.8,
  },
  mutations: {
    setLayout({ layout }, data = {}) {
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined) {
          layout[key] = value;
        }
      });
    },
    setConstrainedBox({ constrainedBox }, data = {}) {
      Object.entries(data).forEach(([key, value]) => {
        if (value == null) return;
        constrainedBox[key] = value;
      });
    },
    // 设置屏幕类型
    setScreenType(state, { type, level }) {
      [state.screenType.type, state.screenType.level] = [type, level];
    },
    /**
     * 添加页面缓存
     * @param state 全局状态
     * @param page 拥有 <RouterView> 标签的组件，被引用到路由中，在路由中的 name，用于区分缓存列表
     * @param name 组件可以拥有多个 <RouterView> 时，需指定 name, 若只有一个，默认 'default'
     * @param alive 需要被缓存的组件，其自身的 name
     */
    addAlive(state, { page, name = 'default', alive }) {
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
    clearAlive(state, { page, name = 'default', alive }) {
      if (state.aliveList[page] && Array.isArray(state.aliveList[page][name])) {
        const index = state.aliveList[page][name].indexOf(alive);
        if (index > -1) {
          state.aliveList[page][name].splice(index, 1);
        }
      }
    },
    addError(state, error) {
      state.errorList.push(error);
      if (state.errorList.length > 500) {
        state.errorList.shift();
      }
    },
  },
  actions: {
    addErrorLog({ commit, rootState }, info) {
      const {
        user: { userId },
      } = rootState;
      commit('addError', {
        ...info,
        time: Date.now(),
        userId,
      });
    },
  },
};
