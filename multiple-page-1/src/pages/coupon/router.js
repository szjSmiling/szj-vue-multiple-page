import Vue from 'vue';
import Router from 'vue-router';
import Coupon from './views/Coupon';

Vue.use(Router);
export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/Coupon',
      name: 'coupon',
      // props: true,
      component: Coupon
    }
  ]
})
