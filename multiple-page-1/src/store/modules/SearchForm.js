import * as type from '../type';
// ({ state, commit, rootState })
// sumWithRootCount (state, getters, rootState)
import http from '@/utils/ApiUtils';
import { searchAirPortCity } from '@/constants/ApiConstants';
import { getYearMonthDayString } from '@/utils/DateFormatUtils';

export const SearchForm = (state = {}) => ({

  state: { ...{
    tripType: 0, // 0 单程 1 往返
    selectedCitys: [{
      'airport': 'Delhi Airport',
      'city': 'Delhi',
      'cn': 'India',
      'iata': 'DEL'
    },
    {
      'airport': "Chhatrapati Shivaji Int'l Airport",
      'city': 'Mumbai',
      'cn': 'India',
      'iata': 'BOM',
    }],
    cityType: 0, // 0出发地， 1目的地
    dateType: 0, //  显示选择去程 时间，回程时间
    departDate: getYearMonthDayString(new Date()),
    returnDate: getYearMonthDayString(new Date()),
    passengers: {
      adult: 1,
      child: 0,
      infant: 0
    },
    flightClass: 'Economy',
    searchHistory: [],
  },
  ...state },
  actions: {
    async [type.SET_SEARCH_FORM] ({ commit }, searchFormObj) {
      const airportArr = await http(searchAirPortCity)
        .then(res => res.data);
      const fromArr = airportArr.filter(v => v.iata === searchFormObj.from.iata.toUpperCase());
      if (fromArr.length !== 0) {
        searchFormObj.from = fromArr[0];
      }
      const toArr = airportArr.filter(v => v.iata === searchFormObj.to.iata.toUpperCase());
      if (toArr.length !== 0) {
        searchFormObj.to = toArr[0];
      }

      commit(type.CHANGE_TYPE, searchFormObj.tripType);
      commit({
        type: type.SET_CITY,
        city: searchFormObj.from,
        cityType: 0,
      });
      commit({
        type: type.SET_CITY,
        city: searchFormObj.to,
        cityType: 1
      });
      commit({
        type: type.SET_DATE,
        date: searchFormObj.departDate,
        dateType: 0
      });
      commit({
        type: type.SET_DATE,
        date: searchFormObj.returnDate,
        dateType: 1
      });
      commit(type.SET_PASSENGER, searchFormObj.passengers);
      commit(type.SET_CLASS, searchFormObj.flightClass);
    }
    // checkout ({ commit, state }, products) {
    //   // 把当前购物车的物品备份起来
    //   const savedCartItems = [...state.cart.added];
    //   // 发出结账请求，然后乐观地清空购物车
    //   commit(types.CHECKOUT_REQUEST);
    //   // 购物 API 接受一个成功回调和一个失败回调
    //   shop.buyProducts(
    //     products,
    //     // 成功操作
    //     () => commit(types.CHECKOUT_SUCCESS),
    //     // 失败操作
    //     () => commit(types.CHECKOUT_FAILURE, savedCartItems)
    //   );
    // }

    // async actionA ({ commit }) {
    //   commit('gotData', await getData())
    // },
    // async actionB ({ dispatch, commit }) {
    //   await dispatch('actionA') // 等待 actionA 完成
    //   commit('gotOtherData', await getOtherData())
    // }
  },
  getters: {

    // adults: 1,
    // airline: ""
    // baby: 0
    // cabinClass: "Economy"
    // carrier: ""
    // childs: 0
    // departDate: "2019-03-27"
    // device: "mobile"
    // from: "DEL"
    // international: false
    // platformProductContent: "SamSung"
    // to: "BOM"

    // SearchToQueryObj: (state) => (id) => {
    //   return state.todos.find(todo => todo.id === id);
    // }
    searchToQueryObj: (state) => {
      const obj = {
        tripType: state.tripType,
        adults: state.passengers.adult,
        baby: state.passengers.infant,
        childs: state.passengers.child,
        departDate: state.departDate,
        from: state.selectedCitys[0].iata,
        to: state.selectedCitys[1].iata,
        cabinClass: state.flightClass,
      }
      state.tripType === 1 && Object.assign(obj, { returnDate: state.returnDate });
      return obj;
    }
  },
  mutations: {
    [type.CHANGE_TYPE] (state, type) {
      state.tripType = type;
    },
    [type.SET_CITY] (state, payload) {
      if (!payload.city) return;
      // // 如果没有cityType 用 state 里的 0 或1；
      const cityType = payload.cityType === undefined ? state.cityType : payload.cityType;
      state.selectedCitys.splice(cityType, 1, payload.city);
    },
    [type.EXCHANGE_CITY] (state) {
      state.selectedCitys = state.selectedCitys.reverse();
    },
    [type.SET_CITY_TYPE] (state, cityType) {
      state.cityType = cityType;
    },
    [type.SET_DATE_TYPE] (state, dateType) {
      state.dateType = dateType;
    },
    [type.SET_DATE] (state, payload) {
      if (!payload.date) return;
      const dataType = payload.dateType || state.dateType;

      // 过期日期 重置到当前时间日期
      // const currentDate = new Date();
      // payload.date = payload.date - currentDate < 0 ? currentDate : payload.date;

      if (dataType === 0) {
        state.departDate = payload.date;
        // 出发日期大时， 回程跟这变大
        if (Date.parse(state.departDate) - Date.parse(state.returnDate) > 0) {
          state.returnDate = state.departDate;
        }
      } else {
        state.returnDate = payload.date;
        // 设置 回程日期 比出发 小， 出发 设置和回程一样
        if (Date.parse(state.departDate) - Date.parse(state.returnDate) > 0) {
          state.departDate = state.returnDate;
        }
      }
    },
    [type.SET_PASSENGER] (state, passengers) {
      if (!passengers) return;
      state.passengers = { ...state.passengers, ...passengers };
    },
    [type.SET_CLASS] (state, flightClass) {
      state.flightClass = flightClass;
    },
    [type.SET_SEARCH_HISTORY] (state, history) {
      state.searchHistory = history;
    }
  }
});
