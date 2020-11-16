import store from '@/store';
import { isObject } from '@/libs/utils';

const TRUE = () => true;

// 系统全局权限路由检查 如果前往路由的路由记录上有一个设置了验权, 则进行 token 校验
// 类似于 'login' 等不验权的页面，需要其路由记录上，全部为 notAuth = true 时, 才会生效
export const hasRouterAuth = to => !to.matched.every(r => r.meta.notAuth);

// `hideInMenu` 属性过滤
const isValidRoute = route => !route.meta?.hideInMenu;

export const getRoutes = (list, decider = TRUE) => {
  if (!Array.isArray(list)) return [];
  return list.reduce((pre, item) => {
    const isValid = isValidRoute(item) && decider(item);
    if (!isValid) return pre;

    const hasChild = !!item.children?.length;
    const children = getRoutes(item.children, decider);
    let newNode = { meta: item.meta, key: item.name };
    const len = children.length;
    // 曾拥有子节点(说明不是叶节点)，但经处理后不存在有效的子节点，则过滤掉
    if (!len && hasChild) return pre;
    // 如果只有一个子节点，则将其提升一级 (但使用当前节点的名称 `title`), `originalKey` 为原父节点 `key`,
    if (len === 1) newNode = { ...children[0], originalKey: newNode.key, title: newNode.title };
    if (len > 1) newNode.children = children;
    pre.push(newNode);
    return pre;
  }, []);
};

/**
 * 加载路由
 * @param files 文件, 使用 `require.context()` 获取
 * @return {Array} 路由数组
 */
export const loadRoutes = files =>
  files
    .keys()
    .reduce((arr, key) => (isObject(files(key).default) ? arr.concat(files(key).default) : arr), [])
    .sort((prev, next) => (prev.sort ?? 0) - (next.sort ?? 0));

const addAlive = to => {
  const length = to.matched.length;
  if (length <= 1) return;
  for (let i = length - 1; i > 0; i--) {
    const [own, parent] = [to.matched[i], to.matched[i - 1]];
    if (!own.meta?.notCache) {
      Object.keys(own.components).forEach(key => {
        // 注意： 父级组件不支持多个 router-view
        store.commit('app/addAlive', {
          page: parent.components.default.name,
          type: key,
          alive: own.components[key].name,
        });
      });
    }
  }
};

/**
 * Add component cache
 * @param to {Route}
 * @return {Promise<void>}
 */
export const addAliveHook = to => Promise.resolve(to).then(addAlive);
