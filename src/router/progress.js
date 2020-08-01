import NProgress from 'nprogress';
import { delay } from '@/libs/utils';

NProgress.configure({
  showSpinner: false,
  easing: 'ease-in-out',
});

export const startProgressGuard = (_, __, next) => {
  NProgress.start();
  next();
};

export const endProgressHook = async () => {
  await delay(100);
  NProgress.done();
};
