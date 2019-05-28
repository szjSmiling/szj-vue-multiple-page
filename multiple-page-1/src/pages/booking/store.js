import Vue from 'vue';
import Vuex from 'vuex';
import http from '@/utils/ApiUtils';
import { bookGetCoupon, getFlights } from '@/constants/ApiConstants';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    flightInfo: {},
    newFlightInfo: {},
    traverInfo: [],
    traverStatus: false,
    contactInfo: {},
    couponInfo: {
      isCouponUse: false,
      couponMap: {},
      couponFailMsg: '',
      couponCode: '',
    },
    contactStatus: false,
    viaCheck: false,
    isGst: false,
    // isIntl: false,
    gstInfo: {},
    insurance: {
      checked: false,
      days: 1,
      price: 0,
      orignPirce: 0
    }
  },
  getters: {
    flightInfo (state) {
      return state.flightInfo;
    },
    itineraryArray (state, getters) {
      return state.newFlightInfo.returnFlight ? [state.newFlightInfo.departFlight, state.newFlightInfo.returnFlight] : [state.newFlightInfo.departFlight];
    },
  },
  actions: {
    async getNewFlight ({ commit }) {
      const token = window.location.search;
      const reponse = await http(getFlights + token);
      if (reponse.success) {
        commit('setNewFlightInfo', reponse.flights);
      }
    },
    async getCoupon ({ commit, state, getters }) {
      if (state.couponInfo.couponCode === '') {
        return commit('setCouponInfo', { couponFailMsg: 'Please enter a valid coupon code', isCouponUse: false })
      }
      const queryData = {
        totalPrice: getters.itineraryArray.reduce((total, val) => total + val.fee.obfp + val.fee.ogst, 0),
        orderNumber: getters.flightInfo.requestFromClient.adults + getters.flightInfo.requestFromClient.baby + getters.flightInfo.requestFromClient.childs,
        tripType: getters.itineraryArray.length,
        productType: getters.flightInfo.type,
        deviceType: 2, // 1:pc , 2:msite, 3:android, 4: ios
        countryType: Number(getters.flightInfo.isIntl), // 0 domestic, 1 internationnal;
        device: 'mobile',
        flightFromRequestList: getters.itineraryArray.map((value, key) => ({
          type: key + 1,
          aircompany: value.al,
          flightNumber: value.flightId,
          startDate: value.dt,
          CabinClass: '',
          bst: value.fee.bfp,
          gst: value.fee.gst
        })),
        couponCode: state.couponInfo.couponCode,
      };

      const response = await http.post(bookGetCoupon, queryData, {
        headers: {
          'x-Device': 'mobile'
        }
      });
      if (response.success) {
        // this.isCouponUse = true;
        // this.couponPri = res.data.totalPrice;
        const couponMap = {
          tradeType: 1,
          tradeAmount: response.data.totalPrice,
          config: { k1: state.couponInfo.couponCode }
        }
        commit('setCouponInfo', { isCouponUse: true, couponMap });
      } else {
        commit('setCouponInfo', { couponFailMsg: response.message, isCouponUse: false })
        // this.couponFailMsg = res.message;
      }
    },
    async setCheckPrice ({ commit, dispatch, state }, isRise) {
      if (isRise === 1) {
        await dispatch('getNewFlight');
        await dispatch('getCoupon');
      }
      commit('setViaCheck', true);
    }
  },
  mutations: {
    setNewFlightInfo (state, playload) {
      state.newFlightInfo = { ...state.newFlightInfo, ...playload };
    },
    setFlightInfo (state, playload) {
      state.flightInfo = { ...state.flightInfo, ...playload };
    },
    setInsurance (state, insurance) {
      state.insurance = { ...state.insurance, ...insurance };
    },
    setTraverInfo (state, info) {
      state.traverInfo = info;
      state.traverStatus = true;
    },
    changeGst (state, flag) {
      state.isGst = flag;
    },
    setGstInfo (state, info) {
      state.isGst = info;
    },
    setContactInfo (state, info) {
      state.contactInfo = info;
      state.contactStatus = true;
    },
    setViaCheck (state, flag) {
      state.viaCheck = flag;
    },
    setCouponInfo (state, playload) {
      state.couponInfo = { ...state.couponInfo, ...playload };
    }
  }
})

export default store;
