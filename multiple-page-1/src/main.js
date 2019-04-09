import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import VeeValidate, { Validator } from "vee-validate";
import { rules } from "./rules.js"; //定义自定义规则

Vue.config.productionTip = false;
/* 
  定义默认required的显示提示
*/
const dict = {
  en: {
    messages: {
      required: () => `This field is required`,
      date_format: () => `This field is required`,
    }
  }
};
Validator.localize(dict);
let config = {
  errorBagName: 'errors', // change if property conflicts.
  fieldsBagName: 'fieldBags',  // 报冲突时 可自定义修改字段名称
  delay: 0, // 错误提示的延迟时间
  strict: true, // 没有设置规则的表单不进行校验，
  enableAutoClasses: false,
  classNames: {
    touched: 'touched', // the control has been blurred
    untouched: 'untouched', // the control hasn't been blurred
    valid: 'valid', // model is valid
    invalid: 'invalid', // model is invalid
    pristine: 'pristine', // control has not been interacted with
    dirty: 'dirty' // control has been interacted with
  },
  events: 'change|blur', //* *input|blur** 在用户输入和表单失去焦点时都进行校验 可单独写  blur或input
  inject: true
};
Vue.use(VeeValidate, config);
for (let key in rules) { // extend注入到validator实例里面
  Validator.extend(key, rules[key]);
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
