import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import plugin from './plugin';

Vue.config.productionTip = false;
console.log(Vue.prototype);
Vue.use(plugin);

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
