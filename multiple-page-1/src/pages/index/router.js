import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home';

const SearchCity = () => import('@/components/SearchCity');
const Calendar = () => import('@/components/Calendar');
const SearchPassenger = () => import('@/components/SearchPassenger');
Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      children: [
        // {
        //   path: '',
        //   component: Home,
        // },
        {
          path: 'search-city',
          name: 'SearchCity',
          component: SearchCity,
          meta: { isMask: true }
        },
        {
          path: 'calendar',
          component: Calendar,
          name: 'Calendar',
          meta: { isMask: true }
        },
        {
          path: 'search-passenger',
          component: SearchPassenger,
          name: 'SearchPassenger',
          meta: { isMask: true }
        }
      ]

    }
  ]
});
