<template>
  <div class="search_city" @click.self="$router.go(-1)">
    <div class="search_city-wrap">
      <i class="search_city-icon_closed s-icon-closed s-icon" @click="$router.go(-1)"></i>
      <div class="search_city-inputs">
        <input type="text" v-focus class="search_city-input" v-model="queryText" :placeholder="`Flying ${cityType===0? 'from': 'to'}...`">
        <i class="search_city-icon_close s-icon-close s-icon" @click="queryText=''"></i>
      </div>
      <ul class="search_city-lists">
        <li class="search_city-list history ellipsis" @click="setCity({city: list})" v-for="(list, key) in historySuitableAirports" :key="key">
          <i class="s-icon-history s-icon"></i>  {{`${list.airport}(${list.iata}), ${list.cn}`}}
        </li>
        <li class="search_city-list ellipsis" @click="setCity({city: list})" v-for="(list, key) in suitableAirports" :key="'A'+key">
            {{`${list.airport}(${list.iata}), ${list.cn}`}}
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import { searchAirPortCity } from '@/constants/ApiConstants';
import { mapMutations, mapState } from 'vuex';
import { SET_CITY, SET_SEARCH_HISTORY } from '@/store/type';
import { addBodyOverHidden, removeBodyOverHidden } from '@/utils/DomUtils';

export default {
  name: 'SearchCity',
  data () {
    return {
      queryText: '',
      airPortLists: []
    };
  },
  computed: {
    ...mapState({
      searchHistory: state => state.SearchForm.searchHistory,
      cityType: state => state.SearchForm.cityType
    }),
    historySuitableAirports () {
      const iatas = [];
      this.searchHistory.forEach(v => {
        iatas.push(v.from);
        iatas.push(v.to);
      })
      const historyList = []
      const uniqueIatas = new Set(iatas);
      uniqueIatas.forEach(v => {
        const item = this.airPortLists.filter(val => val.iata === v)[0];
        item && historyList.push(item);
      })

      return this.getSuitableAirports(this.queryText, historyList, historyList);
    },
    suitableAirports () {
      return this.getSuitableAirports(this.queryText, this.airPortLists);
    },
  },
  directives: {
    focus: {
      inserted: (el, { value = true }) => {
        if (value) {
          el.focus();
        }
      }
    }
  },
  methods: {
    ...mapMutations([
      SET_CITY, SET_SEARCH_HISTORY
    ]),
    getSuitableAirports (keywords, allLists, defaultList) {
      if (keywords.length < 2) {
        return defaultList || [];
      } else {
        let lists = [];
        const reg = new RegExp(keywords, 'ig');
        allLists && allLists.forEach(val => {
          if (val.iata === keywords.toUpperCase()) {
            lists.push(val);
          } else if (reg.test(val.airport + val.iata + val.city)) {
            lists.push(val);
          }
        });
        return lists;
      }
    },
    getAirports () {
      this.$http(searchAirPortCity)
        .then(res => {
          this.airPortLists = res.data;
        });
    },
    getHistory () {
      if (window.localStorage.getItem('searchHistory')) {
        const searchHistory = JSON.parse(window.localStorage.getItem('searchHistory'));
        // this.setHistoryForm(searchHistory[0]);
        this.SET_SEARCH_HISTORY(searchHistory.slice(0, 10));
      }
    },
    setCity (cityObj) {
      this.SET_CITY(cityObj);
      this.$router.go(-1);
    },
  },
  created () {
    addBodyOverHidden();

    this.getAirports();
    this.searchHistory.length === 0 && this.getHistory();
  },
  beforeDestroy () {
    removeBodyOverHidden();
  }
};
</script>
<style lang="scss" scoped>
.search_city{
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  z-index: 20;
  // background-color: rgba($color: #000000, $alpha: .7);
}
.search_city-wrap{
  position: relative;
  width: 100%;
  height: 100%;
  padding-top: 0.3rem;
  border-radius: .16rem;
  background-color: #fff;
  margin-top: 1.37rem;
  z-index: 30;
}
.search_city-icon_closed{
  position: absolute;
  left: 50%;
  top: -0.7rem;
  transform: translateX(-50%);
}
.search_city-inputs{
  position: relative;
  width: 6.6rem;
  margin: 0 auto;
}
.search_city-input{
  width: 6.6rem;
  height: 0.68rem;
  padding: 0 0.2rem;
  font-weight: bold;
  font-size: 0.28rem;
  border-radius: 0.12rem;
  background-color: #eaeaea;
  &:active{
    border-color: $green;
  }
}
.search_city-icon_close{
  position: absolute;
  right: 0.3rem;
  top: 50%;
  transform: translateY(-50%);
}
.search_city-lists{
  padding: 0 0.3rem;
}
.search_city-list{
  width: 100%;
  height: 0.78rem;
  line-height: 0.78rem;
  color: $lighterBlack;
  padding-left: 0.2rem;
  border-bottom: 1px solid  #dcdcdc;
  &.history{
    font-weight: bold;
    color: $lightBlack;
  }
}
</style>
