import NProgress from 'nprogress';

NProgress.configure({ showSpinner: false, easing: 'ease-in-out' });

const delay = timeout => new Promise(resolve => setTimeout(resolve, timeout));

export const startProgressGuard = (_, __, next) => {
  NProgress.start();
  next();
};

export const endProgressHook = async () => {
  await delay(100);
  NProgress.done();
};
