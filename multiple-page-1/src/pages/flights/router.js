import Vue from 'vue';
import Router from 'vue-router';
import Flights from './views/Flights';
import Confirm from './views/Confirm';

const SearchForm = () => import('./views/SearchForm');
const SearchCity = () => import('@/components/SearchCity');
const Calendar = () => import('@/components/Calendar');
const SearchPassenger = () => import('@/components/SearchPassenger');
const FlightsFilter = () => import('./views/FlightsFilter.vue');

Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/flights/:citys/:date',
      component: Flights,
      meta: {
        keepAlive: true
      },
      beforeEnter (to, from, next) {
        const reg = /(\/flights-filter|(\/search-form(\/search-city|\/calendar|\/search-passenger)?)|&return=\d{0,3})/g
        if (to.fullPath.match(reg)) {
          next(router.replace({ path: to.fullPath.replace(reg, '') }))
        }
        next();
      },
      children: [
        {
          path: 'flights-filter',
          component: FlightsFilter,
          name: 'FlightsFilter',
          // beforeEnter (to, from, next) {
          //   Object.assign(to.query, from.query);
          //   next()
          // },
        }, {
          path: 'search-form',
          component: SearchForm,
          // name: 'SearchForm',
          // beforeEnter (to, from, next) {
          //   Object.assign(to.query, from.query);
          //   next()
          // },
          meta: { isMask: true },
          children: [
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
            }]
        }]
    },
    {
      path: '/flights/confirm',
      name: 'confirm',
      component: Confirm,
      props: true,
      meta: {
        keepAlive: false
      }
    }
  ]
});

export default router;
