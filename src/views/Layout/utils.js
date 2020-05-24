import { getVisibleRoutes } from '@/router';

export const getVisibleList = key => {
  const visibleRoutes = getVisibleRoutes();
  const target = visibleRoutes.find(v => v.key === key);
  return target?.children ?? [];
};
