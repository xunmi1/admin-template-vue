import { isArray } from './type';

// 构建树结构
export function createTree(decider, data, parent) {
  const [list, rest] = collector(decider, data, parent);
  if (!rest.length) return list;
  return list.map(({ ...item }) => {
    const children = createTree(decider, rest, item);
    if (children.length) item.children = children;
    return item;
  });
}

// 扁平树结构
export function flatTree(walker, data, parent, level = 1) {
  return data.reduce((arr, item) => {
    const value = walker(item, parent, level);
    arr.push(value);
    if (isArray(item.children)) {
      arr.push(...flatTree(walker, item.children, value, level + 1));
    }
    return arr;
  }, []);
}

const collector = (decider, data, parent) =>
  data.reduce(
    (arr, item) => {
      const bool = decider(item, parent);
      arr[+!bool].push(item);
      return arr;
    },
    [[], []]
  );

// 从树结构中找到目标节点
export const findNode = (decider, data) =>
  data.reduce((target, item) => {
    if (target) return target;
    if (decider(item)) return item;
    const hasChild = !!item.children?.length;
    if (hasChild) return findNode(decider, item.children);
    return target;
  }, undefined);

const walkParent = (path, decider, list) =>
  isArray(list) &&
  list.some(item => {
    if (decider(item, list)) return true;
    path.push(item);
    const isTarget = walkParent(path, decider, item.children);
    if (!isTarget) path.pop();
    return isTarget;
  });

// 获取树结构的父节点元素列表
export const getParentsFromTree = (decider, data) => {
  const list = [];
  walkParent(list, decider, data);
  return list;
};

// 遍历树结构数据
export const walkTree = (transfer, data = []) =>
  data.map(({ children, ...node }) => {
    const newNode = transfer(node, data);
    if (isArray(children)) newNode.children = walkTree(transfer, children);
    return newNode;
  });
