import Vue from 'vue';
import Router from 'vue-router';

import Trip from './views/Trip';
import Login from '@/components/Login';
import TripDetail from './views/TripDetail';
import CancelTrip from './views/CancelTrip';
import ChangeTrip from './views/ChangeTrip';
import Tripback from './views/back';
import store from '@/store/index';

Vue.use(Router);
const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/trip',
      name: 'trip',
      component: Trip,
      meta: {
        requireAuth: true,
      }
    },
    {
      path: '/trip/detail',
      name: 'tripdetail',
      component: TripDetail,
      meta: {
        requireAuth: true,
      }
    },
    {
      path: '/trip/canceltrip/:tripId',
      props: true,
      name: 'CancelTrip',
      component: CancelTrip
    },
    {
      path: '/trip/changetrip/:tripId',
      props: true,
      name: 'ChangeTrip',
      component: ChangeTrip
    },
    {
      path: '/tripback',
      component: Tripback
    },
  ]
});
router.beforeEach((to, from, next) => {
  // if (to.matched.some(record => record.meta.requiresAuth)) {
  if (to.meta.requireAuth) {
    if (store.state.MyTripList.authToken) {
      next();
    } else {
      next(
        router.replace({
          path: '/login',
          query: { redirect: to.fullPath }
        })
      )
    }
  } else {
    next();
  }
});

export default router;
