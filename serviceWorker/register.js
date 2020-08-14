/* eslint-disable */
import { register } from 'register-service-worker';
import { notification } from 'ant-design-vue';

const isProduction = process.env.NODE_ENV === 'production';
const noticeKey = '__SERVICE_WORKER_NOTIFICATION__'

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
  updatefound(registration) {
    console.log('New content is downloading.');
    const isFirst = !registration.active;
    if (isFirst) return;
    const icon = h => h('AIcon', { props: { type: 'cloud-download' }, style: { color: '#1890ff' } });
    notification.open({ key: noticeKey, message: '发现新内容', description: '正在下载与更新中...', duration: 0, icon });
  },
  updated() {
    console.log('New content is available; please refresh.');
    notification.success({ key: noticeKey, message: '发现新内容', description: '已完成更新' });
  },
  offline() {
    console.log('No internet connection found. App is running in offline mode.');
    notification.info({ message: '当前处于离线模式' });
  },
  error(error) {
    console.error('Error during service worker registration:', error);
  },
};

if (isProduction) {
  // 此处注册名需要和 vue.config 中 pwa.workboxOptions.swDest 保持同步
  register(`${process.env.BASE_URL}service-worker.js`, hooks);
}
