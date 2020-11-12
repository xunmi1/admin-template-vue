import { getVisibleRoutes, findNode } from '@/router';

export const getVisibleTree = key => {
  const visibleRoutes = getVisibleRoutes();
  const target = findNode(v => v.key === key, visibleRoutes);
  return target?.children ?? [];
};
