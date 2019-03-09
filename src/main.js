import '@babel/polyfill';
import Vue from 'vue';
import App from './App.vue';
import plugin from './plugin';
import router from './router';
import store from './store';
import './serviceWorker/register';

Vue.config.productionTip = false;
// 开启后可观察组件性能
Vue.config.performance = false;

Vue.use(plugin);

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
