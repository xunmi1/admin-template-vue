/* eslint-disable */
import { register } from 'register-service-worker';

const isProduction = process.env.NODE_ENV === 'production';

const hooks = {
  ready() {
    console.log(
      'App is being served from cache by a service worker.\n' +
      'For more details, visit https://goo.gl/AFskqB',
    );
  },
  registered() {
    console.log('Service worker has been registered.');
  },
  cached() {
    console.log('Content has been cached for offline use.');
  },
  updatefound() {
    console.log('New content is downloading.');
  },
  updated() {
    console.log('New content is available; please refresh.');
  },
  offline() {
    console.log('No internet connection found. App is running in offline mode.');
  },
  error(error) {
    console.error('Error during service worker registration:', error);
  },
}

if (isProduction) {
  // 此处注册名需要和 vue.config 中 pwa.workboxOptions.swDest 保持同步
  register(`${process.env.BASE_URL}service-worker.js`, hooks);
}
