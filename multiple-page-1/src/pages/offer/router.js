import Vue from 'vue';
import Router from 'vue-router';
import Offer from './views/Offer';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/offer',
      name: 'offer',
      component: Offer
    }
  ]
});
