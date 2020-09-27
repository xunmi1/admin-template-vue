import { getVisibleRoutes } from '@/router';

export const getVisibleTree = key => {
  const visibleRoutes = getVisibleRoutes();
  const target = visibleRoutes.find(v => v.key === key);
  return target?.children ?? [];
};
