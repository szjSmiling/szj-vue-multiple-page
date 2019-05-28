import Vue from 'vue';
import App from './App.vue';
import router from './router.js';
import 'mint-ui/lib/style.css';
import FontUtils from '@/utils/FontUtils';
import fetch from '@/utils/ApiUtils';
import store from '@/store/index';
import FastClick from 'fastclick';
import { addCommas } from '@/utils/NumberUtils';
import { Range, Checklist } from 'mint-ui';

if ('addEventListener' in document) {
  document.addEventListener('DOMContentLoaded', function () {
    FastClick.attach(document.body);
  }, false);
}

FontUtils.init();
Vue.prototype.$http = fetch;
Vue.filter('addCommas', addCommas);
Vue.component(Range.name, Range);
Vue.component(Checklist.name, Checklist);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
