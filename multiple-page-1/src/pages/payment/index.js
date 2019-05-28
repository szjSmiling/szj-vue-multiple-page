import Vue from 'vue';
import App from './App';
import router from './router.js';
import FontUtils from '@/utils/FontUtils';
import fetch from '@/utils/ApiUtils';
import { addCommas, padZero } from '@/utils/NumberUtils';
import store from '@/store/index';
import 'mint-ui/lib/style.css';
import base64 from 'js-base64';
import rules from './rules.js';
import VeeValidate, { Validator } from 'vee-validate';

for (let rule in rules) {
  Validator.extend(rule, rules[rule]);
}
Vue.use(VeeValidate, {
  events: 'blur'
});

FontUtils.init();

Vue.prototype.$http = fetch;
Vue.prototype.$Base64 = base64.Base64;
Vue.filter('addCommas', addCommas);
Vue.filter('padZero', padZero);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
