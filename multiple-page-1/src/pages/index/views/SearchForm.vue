<template>
  <div class="search_form">
    <div class="search_form-ways">
    <div class="search_form-ways-box">
      <div class="search_form-way" :class="tripType === 0? 'active' : ''" @click="CHANGE_TYPE(0)">
        <span class="search_form-way-text" >ONE WAY</span>
      </div>
      <div class="search_form-way" :class="tripType === 0? '' : 'active'" @click="CHANGE_TYPE(1)">
        <span class="search_form-way-text">ROUND TRIP</span>
      </div>
    </div>
    <a href="/trip" class="search_form-trips-link">
      My Trip &gt;
    </a>
    </div>
    <div class="search_form-cities">
      <div>
        <div class="search_form-label">
          From
        </div>
        <div class="search_form-city"
        :class="{active: cityType === 0, error: isIataSame}"
        @click="openCityLayer(0)">
          <div class="search_form-city-code">
            {{selectedCitys[0].iata}}
          </div>
          <div class="search_form-city-text">
            {{selectedCitys[0].airport}}
          </div>
        </div>
      </div>

      <div class="search_form_exchange-circle" @click="EXCHANGE_CITY(); toggleActive = !toggleActive">
        <i class="s-icon s-icon-exchange" :class="{'s-icon-exchange-active': toggleActive}"></i>
      </div>
      <div>
        <div class="search_form-label">
          To
        </div>
        <div class="search_form-city"
        :class="{active: cityType === 1, error: isIataSame}"
        @click="openCityLayer(1)">
          <div class="search_form-city-code">
            {{selectedCitys[1].iata}}
          </div>
          <div class="search_form-city-text">
            {{selectedCitys[1].airport}}
          </div>
        </div>
      </div>
    </div>
    <div class="search_form-cities-error" v-if="isIataSame">
     &#9888; "From" and "To" destination can't be the same
    </div>
    <div class="search_form-calendars">
      <div class="search_form-calendar-box">
        <div class="search_form-label">
          Departure Date
        </div>
        <div class="search_form-calendar" @click="openCalendar(0)">
          <!-- <div class="s-icon-calendar s-icon"></div> -->
          <div class="search_form-calendar-text">
            {{getDayMonthYearString(new Date(departDate))}}
          </div>
        </div>
      </div>
      <div class="search_form-calendar-box" v-if="tripType===1">
        <div class="search_form-label">
          Return Date
        </div>
        <div class="search_form-calendar" @click="openCalendar(1)">
          <!-- <i class="s-icon-calendar s-icon"></i> -->
          <div class="search_form-calendar-text">
            {{getDayMonthYearString(new Date(returnDate))}}
          </div>
        </div>
      </div>
    </div>

    <div class="search_form-label" style="padding: 0 0.3rem">Traveler and Class</div>
    <div class="search_form-passenger" @click="openPassenger">
      <!-- <i class="s-icon-user s-icon"></i> -->
      <div class="search_form-passenger-text">
        {{`${passengers.adult + passengers.child + passengers.infant} Traveler, ${flightClass}`}}
      </div>
    </div>
    <div class="serch_form-search" @click="searchFlight">
      Search
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import { SET_CITY_TYPE, SET_DATE_TYPE, CHANGE_TYPE, EXCHANGE_CITY } from '@/store/type';
import { getDayMonthYearString } from '@/utils/DateFormatUtils.js';

export default {
  name: 'SearchForm',
  components: {
  },
  data () {
    return {
      getDayMonthYearString,
      toggleActive: false,
    };
  },
  computed: {
    ...mapState({
      tripType: (state) => state.SearchForm.tripType,
      selectedCitys: (state) => state.SearchForm.selectedCitys,
      cityType: (state) => state.SearchForm.cityType, // 出发地， 目的地
      // dateType: 0, //  去程 时间，回程时间
      departDate: (state) => state.SearchForm.departDate,
      returnDate: (state) => state.SearchForm.returnDate,
      passengers: (state) => state.SearchForm.passengers,
      flightClass: (state) => state.SearchForm.flightClass
    }),
    isIataSame () {
      return this.selectedCitys[0].iata === this.selectedCitys[1].iata;
    }
  },
  methods: {
    ...mapMutations([
      CHANGE_TYPE,
      SET_CITY_TYPE,
      SET_DATE_TYPE,
      EXCHANGE_CITY
    ]),
    openCityLayer (type) {
      this.SET_CITY_TYPE(type);
      this.$router.push({ name: 'SearchCity' });
    },
    openCalendar (type) {
      this.SET_DATE_TYPE(type);
      this.$router.push({ name: 'Calendar' });
    },
    openPassenger () {
      this.$router.push({ name: 'SearchPassenger' });
    },
    searchFlight () {
      if (this.isIataSame) return;
      const dateString = this.tripType === 0 ? `${this.departDate}` : `${this.departDate}-${this.returnDate}`;

      const href = `/flights/${this.selectedCitys[0].iata}-${this.selectedCitys[1].iata}/${dateString}/?adults=${this.passengers.adult}&childs=${this.passengers.child}&infants=${this.passengers.infant}&cabinClass=${this.flightClass}`;

      location.href = href;
    }

  },
};
</script>

<style lang="scss" scoped>
.search_form{
  position: relative;
  background-color: #fff;
  padding-bottom: 0.3rem;
  box-shadow:0rem 0.02rem 0.06rem 0rem rgba(174,174,174,0.5);
}
.search_form-ways{
  position: absolute;
  top: -0.55rem;
  height: 0.55rem;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 0.3rem;
}
.search_form-label{
  font-size: $h5;
  font-weight: bold;
  color: $lightBlack;
  margin-bottom: 0.1rem;
}
.search_form-ways-box{
  display: flex;
  height: 100%;
}
.search_form-way{
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.1rem;
  height: 100%;
  font-size: $h5;
  font-weight: bold;
  color: #666;
  border-radius: 0.12rem 0.12rem 0 0;
  // border: 1px solid $green;
  // & + .search_form-way{
  //   border-radius: 0 0.08rem 0.08rem 0;
  // }
  background-color: #EAEAEA;
  &.active{
    background-color: #fff;
    color: $green;
  }
}
.search_form-trips-link{
  font-size: $h5;
  font-weight: bold;
  color: #fff;
}
.search_form_exchange-circle{
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 0.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 0.6rem;
  height: 0.6rem;
  border-radius: 50%;
  background-color: #fff;
  box-shadow:0rem 0.02rem 0.06rem 0rem rgba(174,174,174,0.5);
}
.s-icon-exchange{
  transition: 0.5s;
}
.s-icon-exchange-active{
  transform: rotate(180deg);
}
.search_form-cities{
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.3rem 0.3rem 0;
  margin-bottom: 0.2rem;
}
.search_form-city{
  width: 3.2rem;
  height: 1.83rem;
  padding: 0.2rem 0.3rem 0;
  // text-align: center;
  background-color: rgba(250,250,250,1);
  border-radius: 0.12rem;
  border: 1px solid #dcdcdc;
  &.active{
    border-color: $green;
  }
  &.error{
    border-color:#BD0000;
  }
}
.search_form-cities-error{
  padding: 0 0 0.1rem 0.4rem;
  font-size: 0.22rem;
  color: #BD0000;
}
.search_form-city-code{
  font-size: $h1;
  font-weight: bold;
}
.search_form-city-text{
  color:#787878;
  font-size: $h6;
  line-height: .33rem;
}

.search_form-calendars{
  display: flex;
  align-items: center;
  padding: 0 0.3rem;
  margin-bottom: 0.2rem;
}
.search_form-calendar-box{
  width: 100%;
  & + .search_form-calendar-box{
    margin-left: 0.44rem;
  }
}
.search_form-calendar{
  display: flex;
  align-items: center;
  width: 100%;
  background-color: rgba(250,250,250,1);
  height: 0.82rem;
  padding: 0 0.2rem;
  border-radius: 0.12rem;

}
.search_form-calendar-text{
  color: #787878;
  font-size: $h4;
  margin-left: 0.2rem;
}
.search_form-passenger{
  display: flex;
  height: 0.82rem;
  padding: 0 0.2rem;
  margin: 0 0.3rem 0.4rem;
  align-items: center;
  background-color: rgba(250,250,250,1);
  border-radius: 0.12rem;
}
.search_form-passenger-text{
  color: #787878;
  font-size: $h4;
  margin-left: 0.2rem;
}
.serch_form-search{
  @include flexCenter();
  width: 6.2rem;
  height: 0.9rem;
  font-size: $h2;
  font-weight: bold;
  color: #fff;
  border-radius: 0.12rem;
  background-color: $yellow;
  margin: 0 auto;
  &:active{
    background:#CB9323;
  }
}
</style>
