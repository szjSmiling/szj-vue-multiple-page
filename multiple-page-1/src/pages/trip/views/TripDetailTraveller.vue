<template>
  <div class="detail_traveller" v-if="tripTraveller.name && flag">
    <p class="confirm-info-detail-title text-style marBot20">Traveler</p>
    <div class="confirm-info-detail-title2 ">
      {{`${index+1}. ${tripTraveller.ptype}.${travelerNames[0]} ${travelerNames[1]}`}}
      ({{tripTraveller.passengerType | passengerType}})
      <span>{{Tstatus[ticketInfo['status']]}}</span>
    </div>
    <div class="info_PNR marBot20" v-if="tripTraveller.pNR">PNR: {{tripTraveller.pNR}}</div>
    <div class="show_more_detail marBot30">
      <button @click="showMoreDetail">show detail
        <i class="s-icon" :class="flag[index].flag?'s-icon-up':'s-icon-down'"></i>
      </button>
    </div>
    <vertical-toggle >
      <ul class="detail_ul_li" v-show="flag[index].flag">
        <li class="confirm-info-detail-item">
          <div class="text-style s-confirm-general-key">First Name:</div>
          <div class="text-style s-confirm-general-val">{{travelerNames[0]}}</div>
        </li>
        <li class="confirm-info-detail-item">
          <div class="text-style s-confirm-general-key">Last Name:</div>
          <div class="text-style s-confirm-general-val">{{travelerNames[1]}}</div>
        </li>
        <li class="confirm-info-detail-item" v-if="tripTraveller.birthDate">
          <div class="text-style s-confirm-general-key">Date of Birth:</div>
          <div class="text-style s-confirm-general-val">
            {{tripTraveller.birthDate | transTime}}
          </div>
        </li>
        <li class="confirm-info-detail-item" v-if="tripTraveller.country">
          <div class="text-style s-confirm-general-key">Nationality:</div>
          <div class="text-style s-confirm-general-val">{{tripTraveller.country}}</div>
        </li>
        <li class="confirm-info-detail-item" v-if="ticketInfo.ticketno">
          <div class="text-style s-confirm-general-key">Ticket Number:</div>
          <div class="text-style s-confirm-general-val">{{ticketInfo.ticketno}}</div>
        </li>
      </ul>
    </vertical-toggle>
  </div>
</template>
<script>
import { getMonthDayYearString } from '@/utils/DateFormatUtils';
import EventHub from '@/utils/EventHub';
export default {
  props: ['tripTraveller', 'ticketInfo', 'flag', 'mark', 'index'],
  components: {
    VerticalToggle: () => import('@/utils/vertical-toggle.js')
  },
  data () {
    return {
      getMonthDayYearString
    }
  },
  filters: {
    transTime (val) {
      let birth = val.split('-');
      let newB = new Date(`${birth[2]}/${birth[1]}/${birth[0]}`);
      return getMonthDayYearString(newB);
    },
    passengerType (val) {
      let type;
      if (val === 1) {
        type = 'adult';
      } else if (val === 2) {
        type = 'children';
      } else {
        type = 'infant';
      }
      return type;
    }
  },
  computed: {
    travelerNames () {
      return this.tripTraveller.name.split('/');
    },
    Tstatus () {
      return this.$store.state.MyTripList.Tstatus
    }
  },
  methods: {
    showMoreDetail () {
      EventHub.$emit('showOrhideTravel', { mark: this.mark, index: this.index });
    }
  }
}
</script>
<style lang="scss" scoped>
.marBot20{
  margin-bottom: 0.2rem;
}
.marBot30{
  margin-bottom: 0.3rem;
}
.text-style{
  font-size: 0.24rem;
  line-height: 0.3rem;
}
.confirm-info-detail-title{
    color:$lightBlack;
    font-weight: bold;
    padding-top: 0.3rem;
    border-top:1px solid #eee;
}
.confirm-info-detail-title2{
  color:$lightBlack;
  font-weight: 900;
  font-size: 0.24rem;
  color: #333;
  line-height: 0.3rem;
  margin-bottom: 0.1rem;
  span{
    float: right;
    color:$lightBlack;
    font-weight: normal;
  }
}
.info_PNR{
  color:$lightBlack;
  font-size: 0.22rem;
  line-height: 0.27rem;
}
.confirm-info-detail-item{
  margin-bottom: 0.1rem;
  display: flex;
  align-items: center;
}
.s-confirm-general-key{
  width: 30%;
  color:rgba(153,153,153,1);
}
.s-confirm-general-val{
  width: 70%;
  color:rgba(17,17,17,1);
}
.show_more_detail{
  @include flexCenter;
  justify-content: flex-end;
  button{
    color:$green;
    background: transparent;
  }
  .s-icon-down,.s-icon-up{
    margin-left: 0.1rem;
  }
}
.detail_ul_li{
  li:last-child{
    margin-bottom: 0.2rem;
  }
}
</style>
