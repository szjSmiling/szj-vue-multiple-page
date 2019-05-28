<template>
  <div class="list noselect" >
    <div :class="{'no_data-class':sortFlightsList.length <= 0}" style="padding:0.3rem 0.3rem 0;">
      <template v-if="tripType === 1 && isInternational">
        <div v-for="(item, index) in sortFlightsList" :key="index">
          <div class="flight_limit">
            <International :flightInfo ="item" :pCount="pCount" :advImagelist="advImagelist" @click.native="selectFlight(item)" />
            <div class="limit-text flex align-items-center space-between"
              v-if="flightLimiter == []?false:getNumberLimitInt(item)">
              <p><i class="s-icon s-icon-caution"></i>Avaliable for <span>{{getNumberInt(item.aln, item.al)}}</span> traveler or less.</p>
              <button @click="jumpToHome">Modify</button>
            </div>
            <div class="flight-cover" v-if="flightLimiter == []?false:getNumberLimitInt(item)"></div>
          </div>
          <div class="adv_images" v-if="sortFlightsList.length > 0 && advImagelist[parseInt(index / 4)] && (index+1)% 4 === 1">
            <a :href="advImagelist[parseInt(index / 4)].href">
              <img :src="advImagelist[parseInt(index / 4)].url" alt="">
            </a>
          </div>
        </div>
      </template>
      <template v-else>
        <div v-for="(item, index) in sortFlightsList" :key="index">
          <div class="flight_limit">
            <Oneway :flightInfo="item" @click.native="selectFlight(item)" />
            <div class="limit-text"
              v-if="flightLimiter == []?false:getNumberLimit(item, item.aln, item.al)">
              <p><i class="s-icon s-icon-caution"></i>Avaliable for <span>{{getNumber(item.aln, item.al)}}</span> traveler or less.</p>
              <button @click="jumpToHome">Modify Search</button>
            </div>
            <div class="flight-cover" v-if="flightLimiter == []?false:getNumberLimit(item, item.aln, item.al)"></div>
          </div>
          <div class="adv_images" v-if="sortFlightsList.length > 0 && advImagelist[parseInt(index / 4)] && ((index+1)% 4 === 1)" >
            <a :href="advImagelist[parseInt(index / 4)].href">
              <img :src="advImagelist[parseInt(index / 4)].url" alt="">
            </a>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters, mapMutations } from 'vuex';
import { getRoundTripPrice } from '@/constants/ApiConstants';
import { SET_SELECTED_FLIGHTS } from '@/store/type';
import { airlineDiscount } from '@/utils/airlineDiscount';
import { MessageBox } from 'mint-ui';

export default {
  props: {
    advImagelist: Array,
    // flightLimiter: Array
  },
  components: {
    Oneway: () => import('@/components/FlightInfo.vue'),
    International: () => import('@/components/FlightInfoInter.vue')
  },
  data () {
    return {
      pCount: null,
      showDepartList: true,
      showReturnList: false
    };
  },
  computed: {
    ...mapState({
      tripType: state => state.SearchForm.tripType,
      showWhichFlights: state => state.FlightInfo.showWhichFlights,
      selectedFlights: state => state.FlightInfo.selectedFlights,
      flightsDataConfig: state => state.FlightInfo.flightsData.x
    }),
    ...mapGetters([
      'isInternational',
      'sortFlightsList'
    ]),
    flightLimiter () {
      return this.flightsDataConfig.flightLimiter.split(',').map(val => ({
        fn: val.split(':')[0],
        limit: Number(val.split(':')[1])
      }))
    },
  },
  methods: {
    ...mapMutations([SET_SELECTED_FLIGHTS]),
    selectFlight (item) {
      // 国内 往返 选择去程
      if (!this.isInternational && this.tripType === 1 && this.showWhichFlights === 0) {
        this.SET_SELECTED_FLIGHTS({ data: item, index: 0 })
        this.$router.push(`${location.pathname}${location.search}&return=${item.id}`)
        return;
      }
      // 单程或国际
      if (this.tripType === 0 || this.isInternational) {
        this.SET_SELECTED_FLIGHTS({ data: item, index: 0 })
        this.$router.push(`/flights/confirm`)
        return;
      }
      // 第二次选择回程
      if (this.showWhichFlights === 1) {
        // 设置 选择的航班
        this.SET_SELECTED_FLIGHTS({ data: item, index: 1 });

        this.getRountTirpPrice().then(res => {
          if (res.code !== 0) {
            return MessageBox({
              title: '',
              message: res.message,
              showCancelButton: false,
              confirmButtonText: 'OK',
            });
          }
          const newDepart = { ...this.selectedFlights[0],
            ...{
              fee: { ...this.selectedFlights[0].fee, ...res.data.departFlight.fee },
              feee: res.data.departFlight.feee,
            },
          }
          const newReturn = { ...this.selectedFlights[1],
            ...{
              fee: { ...this.selectedFlights[1].fee, ...res.data.returnFlight.fee },
              feee: res.data.returnFlight.feee,
            },
          }
          // 设置新的往返
          this.SET_SELECTED_FLIGHTS({ data: newDepart, index: 0 });
          this.SET_SELECTED_FLIGHTS({ data: newReturn, index: 1 });
          // 跳转
          // const departId = this.$route.query.departid;
          this.$router.replace(`/flights/confirm`)
        })
      }
    },

    getRountTirpPrice () {
      const departF = this.selectedFlights[0];
      const returnF = this.selectedFlights[1];
      const sendData = {
        departFlight: {
          fee: departF.fee,
          fn: departF.fn,
          feee: departF.feee,
        },
        returnFlight: {
          fee: returnF.fee,
          fn: returnF.fn,
          feee: returnF.feee,
        },
        rtd: airlineDiscount({ fn: departF.fn, al: departF.al }, { fn: returnF.fn, al: returnF.al }, this.flightsDataConfig.rtd).ord,
      };
      return this.$http.post(getRoundTripPrice, sendData);
    },
    getNumber (item, fn) {
      let str1; let str2; let num1 = 0; let num2 = 0;
      this.flightLimiter.forEach(e => {
        if (item.indexOf('/') > -1 && item.split('/')[1]) { // more then one airline
          str1 = item.split('/')[0].substr(0, 2);
          str2 = item.split('/')[1].substr(0, 2);
          if (e.fn === str1) {
            num1 = e.limit;
          }
          if (e.fn === str2) {
            num2 = e.limit
          }
          if (num1 !== 0 && num2 !== 0) {
            num1 = num1 - num2 >= 0 ? num2 : num1;
          } else {
            if (num1 === 0) {
              num1 = num2
            }
          }
        } else { // single airline
          if (e.fn === fn) {
            num1 = e.limit;
          }
        }
      })
      return num1;
    },
    getNumberLimit (who, item, fn) {
      let str1; let str2; let flag = false;
      let number = who.fee.pCount;
      this.flightLimiter.forEach(e => {
        if (item.indexOf('/') > -1 && item.split('/')[1]) { // more then one airline
          str1 = item.split('/')[0].substr(0, 2);
          str2 = item.split('/')[1].substr(0, 2);
          if ((e.fn === str1 || e.fn === str2) && (e.limit - number < 0)) {
            flag = true;
          }
        } else { // single airline
          if (e.fn === fn && (e.limit - number < 0)) {
            flag = true;
          }
        }
      })
      return flag;
    },
    getNumberInt (who) {
      let str1; let str2; let num1 = 0; let num11 = 0; let num2 = 0; let num22 = 0;
      let dItem = who.departFlight.aln;
      let rItem = who.returnFlight.aln;
      let dFn = who.departFlight.al;
      let rFn = who.returnFlight.al;
      this.flightLimiter.forEach(e => {
        if (dItem.indexOf('/') > -1 && dItem.split('/')[1]) { // more then one airline
          str1 = dItem.split('/')[0].substr(0, 2);
          str2 = dItem.split('/')[1].substr(0, 2);
          if (e.fn === str1) {
            num1 = e.limit;
          }
          if (e.fn === str2) {
            num11 = e.limit;
          }
          num1 = num1 - num11 >= 0 ? num11 : num1;
        } else { // single airline
          if (e.fn === dFn) {
            num1 = e.limit;
          }
        }
        if (rItem.indexOf('/') > -1 && rItem.split('/')[1]) { // more then one airline
          str1 = rItem.split('/')[0].substr(0, 2);
          str2 = rItem.split('/')[1].substr(0, 2);
          if (e.fn === str1) {
            num2 = e.limit;
          }
          if (e.fn === str2) {
            num22 = e.limit;
          }
          num2 = num2 - num22 >= 0 ? num22 : num2;
        } else { // single airline
          if (e.fn === rFn) {
            num2 = e.limit;
          }
        }
      })
      if (num1 !== 0 && num2 !== 0) {
        if (num1 - num2 >= 0) {
          return num2
        } else {
          return num1
        }
      } else {
        if (num1 === 0) { return num2 };
        if (num2 === 0) { return num1 };
      }
    },
    getNumberLimitInt (who) {
      this.pCount = parseInt(this.$route.query.adults) + parseInt(this.$route.query.childs) + parseInt(this.$route.query.infants);
      let str1; let str2; let flag = false;
      let dItem = who.departFlight.aln;
      let rItem = who.returnFlight.aln;
      let dFn = who.departFlight.al;
      let rFn = who.returnFlight.al;
      let number = this.pCount;
      this.flightLimiter.forEach(e => {
        if (dItem.indexOf('/') > -1 && dItem.split('/')[1]) { // more then one airline
          str1 = dItem.split('/')[0].substr(0, 2);
          str2 = dItem.split('/')[1].substr(0, 2);
          if ((e.fn === str1 || e.fn === str2) && (e.limit - number < 0)) {
            flag = true;
          }
        } else { // single airline
          if (e.fn === dFn && (e.limit - number < 0)) {
            flag = true;
          }
        }
        if (rItem.indexOf('/') > -1 && rItem.split('/')[1]) { // more then one airline
          str1 = rItem.split('/')[0].substr(0, 2);
          str2 = rItem.split('/')[1].substr(0, 2);
          if ((e.fn === str1 || e.fn === str2) && (e.limit - number < 0)) {
            flag = true;
          }
        } else { // single airline
          if (e.fn === rFn && (e.limit - number < 0)) {
            flag = true;
          }
        }
      })
      return flag;
    },
    jumpToHome () {
      this.$emit('showSearchForm', true);
    }
  }
};
</script>
<style lang="scss" scoped>
.list{
  background: #f1f1f1;
  margin-bottom: 2.5rem;
}
.no_data-class{
  height:100%;
}
//adv_images
.adv_images a{
  display: block;
  &:active{
    filter: saturate(50%);
  }
}
.adv_images img{
  display: block;
  width:6.6rem;
  height:2rem;
  margin:auto;
  margin-bottom: 0.2rem;
  border-radius:0.04rem;
}
.flight_limit{
  position: relative;
  margin-bottom: 0.2rem;
}
.flight-cover{
  width:100%;
  height:100%;
  position: absolute;
  top: 0;
  left: 0;
  background: transparent;
  z-index:10;
  border-radius: 0.12rem;
}
.limit-text{
  width:100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding:.15rem .3rem;
  font-size:6px;
  background:#787878;
  text-align:left;
  line-height:13px;
  color:#DBDBDB;
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 11;
  border-bottom-left-radius: 0.12rem;
  border-bottom-right-radius: 0.12rem;
  i{
    margin-right: 5px;
    // vertical-align: middle;
  }
  button{
    width: 2rem;
    background: transparent;
    font-size: 7px;
    // color: #0B9D78;
    color: #fff;
    text-align:right;
    cursor: pointer;
    text-decoration:underline;
  }
}
</style>
