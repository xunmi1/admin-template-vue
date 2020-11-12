import { getVisibleRoutes } from '@/router';
import { findNode } from '@/libs/utils';

export const getVisibleTree = key => {
  const visibleRoutes = getVisibleRoutes();
  const target = findNode(v => v.key === key, visibleRoutes);
  return target?.children ?? [];
};
