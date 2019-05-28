import Vue from 'vue';
import App from './App';
import router from './router.js';
import FontUtils from '@/utils/FontUtils';
import fetch from '@/utils/ApiUtils';
import { addCommas } from '@/utils/NumberUtils';
import store from '@/store/index';
import FastClick from 'fastclick';
import 'mint-ui/lib/style.css';

if ('addEventListener' in document) {
  document.addEventListener('DOMContentLoaded', function () {
    FastClick.attach(document.body);
  }, false);
}

FontUtils.init();

Vue.prototype.$http = fetch;
Vue.filter('addCommas', addCommas);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
