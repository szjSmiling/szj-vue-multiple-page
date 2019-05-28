import * as type from '../type';
import { Indicator } from 'mint-ui';
import { countMinutes } from '@/utils/DateFormatUtils'
import { getSearchFlightsURLStirng } from '@/constants/ApiConstants';
import http from '@/utils/ApiUtils';
import _ from 'lodash';

var timeout = null;
export const FlightInfo = {
  state: {
    // flightDetail: null,
    flightsData: {},
    sortType: 0, // bestPirce  shortest departue，
    isInternational: false, // 国际航班
    showWhichFlights: 0, // 显示去程， 1 回程；
    filterOptions: {
      airlines: [],
      stops: [],
      departTime: [0, 23 * 60 + 59], // 00:00 - 23:59 单位分
      returnTime: [0, 23 * 60 + 59],
      prices: [],
      isFiltering: false,
    },
    selectedFlights: [],
    isFetchingFlight: false,
  },
  actions: {
    [type.CHANGE_INTERNATIONAL] ({ commit, dispatch }, flag) {
      // dispatch(type.RESET_FILTER_OPTIONS);
      commit(type.CHANGE_INTERNATIONAL, flag);
    },
    [type.CHANGE_WHICH_FLIGHTS] ({ commit, dispatch }, number) {
      commit(type.CHANGE_WHICH_FLIGHTS, number)
      dispatch(type.RESET_FILTER_OPTIONS);
    },
    // 重置 筛选项
    [type.RESET_FILTER_OPTIONS] ({ commit, getters }) {
      const options = {
        airlines: [],
        stops: [],
        departTime: [0, 23 * 60 + 59], // 00:00 - 23:59 单位分
        returnTime: [0, 23 * 60 + 59],
        prices: InitPriceRange(getters.flightsDataList)
      };
      commit(type.CHANGE_FILTER_OPTIONS, options);
    },
    [type.CHANGE_FILTER_OPTIONS] ({ commit }, playload) {
      clearTimeout(timeout);
      commit(type.CHANGE_FILTER_OPTIONS, { ...playload, isFiltering: true });
      timeout = setTimeout(() => {
        commit(type.CHANGE_FILTER_OPTIONS, { isFiltering: false });
      }, 500)
    },
    [type.STORE_SEARCH_HISTORY] ({ rootState }) {
      const { SearchForm } = rootState;
      const currentSearch = {
        tripType: SearchForm.tripType,
        from: SearchForm.selectedCitys[0].iata,
        to: SearchForm.selectedCitys[1].iata,
        departDate: SearchForm.departDate,
        cabinClass: SearchForm.flightClass,
        adults: SearchForm.passengers.adult,
        childs: SearchForm.passengers.child,
        baby: SearchForm.passengers.infant,
      };
      SearchForm.tripType === 1 && Object.assign(currentSearch, { returnDate: SearchForm.returnDate });
      if (window.localStorage.getItem('searchHistory')) {
        const searchHistory = JSON.parse(window.localStorage.getItem('searchHistory'));
        searchHistory.forEach((v, index) => {
          if (_.isEqual(currentSearch, v)) {
            searchHistory.splice(index, 1);
          }
        })
        searchHistory.unshift(currentSearch);
        window.localStorage.setItem('searchHistory', JSON.stringify(searchHistory.slice(0, 10)));
      } else {
        window.localStorage.setItem('searchHistory', JSON.stringify([currentSearch]));
      }
    },
    async [type.GET_FLIGHTS_LIST] ({ state, commit, rootState, dispatch }) {
      const { SearchForm } = rootState;
      // this.flightLimiter = [];
      Indicator.open({
        spinnerType: 'fading-circle',
        text: 'Searching for lowest price flight.'
      });
      // 保存 搜索条件到 local
      dispatch(type.STORE_SEARCH_HISTORY);
      state.isFetchingFlight = true;

      const url = `${getSearchFlightsURLStirng}?from=${SearchForm.selectedCitys[0].iata}&to=${SearchForm.selectedCitys[1].iata}&adults=${SearchForm.passengers.adult}&childs=${SearchForm.passengers.child}&baby=${SearchForm.passengers.infant}&cabinClass=${SearchForm.flightClass}&tripType=${SearchForm.tripType}&departDate=${SearchForm.departDate}${SearchForm.tripType === 1 ? `&returnDate=${SearchForm.returnDate}` : ''}&airline=&carrier=`;

      const res = await http(url, {
        headers: {
          'x-Device': 'mobile'
        }
      });
        // .then(res => {
      Indicator.close();
      commit(type.SAVE_FLIGHTINFO, res);
      // 设置默认显示去程
      commit(type.CHANGE_WHICH_FLIGHTS, 0);
      dispatch(type.RESET_FILTER_OPTIONS);

      // if (res.success) {
      //   let arr = [];
      //   let arr2 = [];
      //   if (res.x.flightLimiter.indexOf(',') > -1) {
      //     arr = res.x.flightLimiter.split(',');
      //     arr.forEach((e, i) => {
      //       let obj = {};
      //       arr2 = e.split(':');
      //       obj['fn'] = arr2[0];
      //       obj['limit'] = Number(arr2[1]);
      //       this.flightLimiter.push(obj);
      //     })
      //   } else {
      //     let obj = {};
      //     arr = res.x.flightLimiter.split(':');
      //     obj['fn'] = arr[0];
      //     obj['limit'] = Number(arr[1]);
      //     this.flightLimiter.push(obj);
      //   }
      // }

      // })
      // .catch(err => {
      //   Indicator.close();
      //   Toast(err);
      // });
    }
  },
  getters: {
    flightsDataList: (state, getters, rootState) => {
      if (!state.flightsData.success) return [];
      if (getters.isInternational) {
        if (rootState.SearchForm.tripType === 0) {
          return state.flightsData.IntlFlightArray.map(v => ({ ...v.departFlight, id: v.id }));
        } else {
          return state.flightsData.IntlFlightArray;
        }
      } else {
        if (state.showWhichFlights === 0) {
          return state.flightsData.departFlightArray || [];
        } else {
          return state.flightsData.returnFlightArray || []
        }
      }
    },
    isInternational: (state) => state.flightsData.isIntl,
    // 筛选，排序
    suitableFlightsList: (state, getters, rootState) => {
      // if (getters.flightsDataList instanceof Array) {
      if (getters.isInternational && rootState.SearchForm.tripType === 1) {
        // 国际筛选 对每个回程筛选
        return getters.flightsDataList.filter(val => {
          return filterFlights(val.departFlight, state.filterOptions, val) &&
          filterFlights(val.returnFlight, { ...state.filterOptions, departTime: state.filterOptions.returnTime }, val)
        })
      } else {
        return getters.flightsDataList.filter(val => {
          return filterFlights(val, state.filterOptions, val);
        })
      }
      // }
    },
    sortFlightsList: (state, getters, rootState) => {
      if (!getters.suitableFlightsList || getters.suitableFlightsList.length === 0) return [];
      switch (state.sortType) {
        case 0:
          return getters.suitableFlightsList.sort((a, b) => (a.fee.bfp + a.fee.gst) - (b.fee.bfp + b.fee.gst));
        case 1:
          // 国际往返 最短时间排序
          if (getters.isInternational && rootState.SearchForm.tripType === 1) {
            return getters.suitableFlightsList.sort((a, b) => (a.departFlight.adts - a.departFlight.ddts) - (b.departFlight.adts - b.departFlight.ddts));
          }
          // 国内 ， 国际单程 最短时间排序
          return getters.suitableFlightsList.sort((a, b) => (a.adts - a.ddts) - (b.adts - b.ddts));
        case 2:
          // 国际往返 出发时间排序
          if (getters.isInternational && rootState.SearchForm.tripType === 1) {
            return getters.suitableFlightsList.sort((a, b) => a.departFlight.ddts - b.departFlight.ddts);
          }
          // 国内 ， 国际单程 出发时间排序
          return getters.suitableFlightsList.sort((a, b) => a.ddts - b.ddts);
        default:
          return getters.suitableFlightsList;
      }
    }
  },
  mutations: {
    [type.SAVE_FLIGHTINFO] (state, data) {
      state.flightsData = data;
      state.isFetchingFlight = false;
    },
    [type.CHANGE_FLIGHT_SORT] (state, sortString) {
      state.sortType = sortString
    },
    [type.CHANGE_INTERNATIONAL] (state, flag) {
      state.isInternational = flag;
    },
    [type.CHANGE_WHICH_FLIGHTS] (state, number) {
      state.showWhichFlights = number;
    },
    [type.CHANGE_FILTER_OPTIONS] (state, obj) {
      state.filterOptions = { ...state.filterOptions, ...obj };
    },
    [type.SET_SELECTED_FLIGHTS] (state, playload) {
      if (playload.index === 0) {
        state.selectedFlights[0] = playload.data;
      } else {
        state.selectedFlights[1] = playload.data;
      }
    }

  }
};
function InitPriceRange (list) {
  const minItem = _.chain(list).minBy((item) => item.fee.bfp + item.fee.gst).value();
  const maxItem = _.chain(list).maxBy(item => item.fee.bfp + item.fee.gst).value();
  return [minItem.fee.bfp + minItem.fee.gst, maxItem.fee.bfp + maxItem.fee.gst]
}
function filterFlights (flight, filterOptions, val) {
  const { prices, departTime, stops, airlines } = filterOptions;
  if (!flight) return;
  if (prices.length !== 0) {
    const opr = val.fee.gst + val.fee.bfp;
    if (opr !== Math.max(prices[0], Math.min(prices[1], opr))) {
      return false;
    }
  }
  if (departTime.length !== 0) {
    const minutes = countMinutes(new Date(flight.dt));
    if (minutes !== Math.max(departTime[0], Math.min(departTime[1], minutes))) {
      return false;
    }
  }
  if (stops.length !== 0) {
    const stop = flight.sb > 3 ? 3 : flight.sb;
    if (!stops.includes(stop)) {
      return false;
    }
  }
  if (airlines.length !== 0) {
    if (!airlines.includes(flight.al)) {
      return false;
    }
  }
  return true;
}
