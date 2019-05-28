import Vue from 'vue';
import App from './App';
import router from './router.js';
import FontUtils from '@/utils/FontUtils';
import fetch from '@/utils/ApiUtils';
import { addCommas, padZero } from '@/utils/NumberUtils';
import 'mint-ui/lib/style.css';

FontUtils.init();

Vue.prototype.$http = fetch;
Vue.filter('addCommas', addCommas);
Vue.filter('padZero', padZero);
new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
