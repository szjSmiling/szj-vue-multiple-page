import fetch from '@/utils/ApiUtils';
import { Indicator, Toast } from 'mint-ui';
import { queryChannelUserOrder, queryUserOrderDetail } from '@/constants/ApiConstants';
import router from '@/pages/trip/router';

const token = localStorage.getItem('token') && JSON.parse(localStorage.getItem('token'));
const account = localStorage.getItem('account') && JSON.parse(localStorage.getItem('account'));
export const MyTripList = {
  state: {
    status: 1,
    pageNum: 1,
    totalPage: 1,
    pageSize: 8,
    orderId: '',
    isLoading: false,
    isMoreLoading: false,
    noDataShow: false,
    departOrReturn: 1,
    tripInfo: {},
    orderInfo: {},
    voyageInfo: {},
    travellerinfo: {},
    tripDetailInfo: {},
    triplistArray: [],
    statusList: ['', 'Upcoming', 'Unpaid', 'Completed', 'Canceled'],
    Tstatus: {
      1: 'Refunding',
      2: 'Changing',
      3: 'Refunding',
      4: 'Changed',
      5: 'Refunded',
      105: 'Upcoming',
      106: 'Complete',
      107: 'To be paid',
      108: 'Fail',
      109: 'Fail'
    },
    authToken: token,
    userPhoneOrEmail: account
  },
  actions: {
    selectDiffStatus ({ commit, state }, type) {
      commit('reset', type);
      Indicator.open({
        text: 'loading...',
        spinnerType: 'fading-circle'
      });
      let data = {
        pageNum: state.pageNum,
        pageSize: state.pageSize,
        status: state.statusList[type],
        platform: 'SamSung',
        token: state.authToken,
      };
      if (type === 2) {
        data.status = 'To be paid';
      }
      fetch.post(queryChannelUserOrder, data, {
        'Content-Type': 'application/json'
      }).then(res => {
        Indicator.close();
        if (res.code === 0) {
          let arr = res.data.list;
          const data = {
            totalPage: Math.ceil(res.data.total / state.pageSize),
            isLoading: false,
            isMoreLoading: false,
            triplistArray: [...state.triplistArray, ...arr],
            noDataShow: res.data.list.length < 1,
          };
          commit({
            type: 'saveMyTripList',
            data,
          });
        } else if (res.code === 401) {
          router.replace({ path: '/login', query: { redirect: router.currentRoute.path } })
        } else {
          Toast(res.msg);
        }
      });
    },
    changeLoadMoreAction ({ commit, state }, val) {
      state.isLoading = val;
      state.isMoreLoading = val;
      if (val) {
        state.pageNum += 1;
        setTimeout(() => {
          commit('saveMyTripList', state.status);
        }, 500);
      }
    }
  },
  mutations: {
    reset (state, type) {
      state.triplistArray = [];
      state.status = type;
      state.pageNum = 1;
      state.totalPage = 1;
    },
    saveMyTripList (state, playload) { // 更新数据triplist
      Object.assign(state, playload.data);
    },
    saveSearchDetailInfo (state, data) { // 获取trip detail
      let url = `${queryUserOrderDetail}?tripId=${data}&token=${state.authToken}`
      Indicator.open({
        text: 'loading...',
        spinnerType: 'fading-circle'
      });
      fetch(url).then(res => {
        if (res.code === 0) {
          res.data.triplist.forEach(e => {
            let isTicketNo = false;
            // let isOperateable = false;
            e.ticketsinfo.forEach(value => {
              e.travellerinfo.forEach((val, j) => {
                e.isTicketNo = isTicketNo || !!value[j].ticketno;
                if (Number(val.status) === 1) {
                  e.isOperateable = true;
                }
                // e.isOperateable = isOperateable || !!Number(val.status);
                e.Tstatus = state.Tstatus[String(value[j].status)];
              });
            });
            e.isChangeable = e.refundable && e.isOperateable && e.isTicketNo;
          });
          state.tripDetailInfo = res.data;
          state.orderId = res.data.order.orderid;
          state.orderInfo = res.data.order;
          state.tripInfo = res.data.triplist[0];
          state.voyageInfo = res.data.triplist[0].voyageinfo[0];
          state.travellerinfo = res.data.triplist[0].travellerinfo[0];
          Indicator.close();
        }
      })
    },
    setAuthToken (state, token) {
      state.authToken = token;
      window.localStorage.setItem('token', JSON.stringify(token));
    },
    setUserPhoneOrEmail (state, account) {
      state.userPhoneOrEmail = account;
      window.localStorage.setItem('account', JSON.stringify(account));
    }
  }
};
