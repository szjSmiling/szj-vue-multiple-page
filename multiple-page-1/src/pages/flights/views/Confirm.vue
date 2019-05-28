<template>
  <div style="height:100%;">
    <div style="height:100%;">
      <div class="confirm-info">
        <p class="confirm-info-title">Confirm Your Trip</p>
        <div class="confirm-info-detail-box" v-for="(item, index) in flightInfo" :key="index" :class="index == 1 ? 'box_2' : ''">
          <div class="confirm-info-detail">
            <div class="confirm-info-detail-title">{{item.dc}} ({{item.ds}}) - {{item.ac}} ({{item.as}})
            </div>
            <ul>
              <li class="confirm-info-detail-item">
                <div class="s-confirm-general s-confirm-general-key">Operated by:</div>
                <div class="s-confirm-general s-confirm-general-val">{{item.co}}</div>
              </li>
              <li class="confirm-info-detail-item">
                <div class="s-confirm-general s-confirm-general-key">Departure : </div>
                <div class="s-confirm-general s-confirm-general-val">{{flightDate(item.dt)}} <br> {{item.da}}  ({{item.ds}})</div>
              </li>
              <li class="confirm-info-detail-item">
                <div class="s-confirm-general s-confirm-general-key">Arrival:</div>
                <div class="s-confirm-general s-confirm-general-val">{{flightDate(item.at)}} <br> {{item.aa}} ({{item.as}})</div>
              </li>
            </ul>
            <p v-if="index === 0" class="confirm-info-isShowFliDetail"><span class="green" @click="showDetailF(item.fn,item.ddts,item.opr,item.fee.pCount,item.fee.refundable,0)">{{showDetailF_0 ? 'hide':'show'}} flight details <i class="s-icon" :class="showDetailF_0 ? 's-icon-up' : 's-icon-down'"></i></span>  </p>
            <p v-else-if="index === 1" class="confirm-info-isShowFliDetail"><span class="green" @click="showDetailF(item.fn,item.ddts,item.opr,item.fee.pCount,item.fee.refundable,1)">{{showDetailF_1 ? 'hide':'show'}} flight details <i class="s-icon" :class="showDetailF_1 ? 's-icon-up' : 's-icon-down'"></i></span>  </p>
            <vertical-toggle>
              <div v-show="index === 0 ? showDetailF_0 : showDetailF_1">
                <ul>
                  <li class="confirm-info-detail-item">
                    <div class="s-confirm-general s-confirm-general-key">Flight Duration:</div>
                    <div class="s-confirm-general s-confirm-general-val">{{item.wdt}}, {{item.sb == 0 ? 'non': item.sb}}-stop</div>
                  </li>
                  <li class="confirm-info-detail-item">
                    <div class="s-confirm-general s-confirm-general-key">Baggage policy: </div>
                    <div class="s-confirm-general s-confirm-general-val">1 checkin baggage(&lt;{{index === 0 ? d_bagInfo.ch : r_bagInfo.ch}}kg), 1 Cabin Baggage(&lt;{{index === 0 ? d_bagInfo.ca : r_bagInfo.ca}}kg)</div>
                  </li>
                </ul>
                <p class="confirm-info-refundable">{{item.fee.refundable ? 'refundable' : 'none-refundable'}}</p>
              </div>
            </vertical-toggle>
          </div>
        </div>
        <div class="confirm-info-refund">
          <a @click="$router.go(-1)" class="green"><i class="s-icon s-icon-return"></i> reselect</a>
        </div>
      </div>
      <div class="confirm-info-toBooking">
        <div class="confirm-info-toBooking-price">
          <p>
            <span class="confirm-info-toBooking-pri">&#8377;{{perPrice | addCommas}}</span>
            <span class="confirm-info-toBooking-text"> / person</span>
          </p>
        </div>
        <div>
          <a @click="flightCheck" class="btn confirm-info-toBooking-btn">Continue</a>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import VerticalToggle from '@/utils/vertical-toggle.js';
import { mapState, mapGetters } from 'vuex';
import { flightCheck, fareBaggageQueryUrl } from '@/constants/ApiConstants';
import { getWDMY } from '@/utils/DateFormatUtils';

export default {
  data () {
    return {
      showDetailF_0: false,
      showDetailF_1: false,
      isIntl: false,
      d_bagInfo: {

      },
      r_bagInfo: {

      }
    }
  },
  components: {
    VerticalToggle
  },
  props: {
    id: {
      type: String
    }
  },
  computed: {
    ...mapState({
      flightsData: (state) => state.FlightInfo.flightsData,
      selectedFlights: state => state.FlightInfo.selectedFlights,
      tripType: (state) => state.SearchForm.tripType,
      flightsDataConfig: state => state.FlightInfo.flightsData.x,
    }),
    ...mapGetters(['isInternational', 'searchToQueryObj']),
    perPrice () {
      return parseInt(this.flightInfo.reduce((total, v) => total + v.opr / v.fee.pCount, 0));
    },
    flightInfo () {
      // const idArr = this.id.split('-').map(v => parseInt(v));
      if (this.selectedFlights.length === 0) return null;
      const infos = [];
      if (this.isInternational && this.tripType === 1) {
        const intiItem = this.selectedFlights[0];
        // 根据三字码添加城市
        intiItem.departFlight = { ...intiItem.departFlight, ...this.itataToCity(intiItem.departFlight.ds, intiItem.departFlight.as) };

        infos.push(intiItem.departFlight);
        intiItem.returnFlight && infos.push({ ...intiItem.returnFlight, ...this.itataToCity(intiItem.returnFlight.ds, intiItem.returnFlight.as) });
      } else {
        // 添加去程的航班
        const depart = this.selectedFlights[0];
        Object.keys(depart).length !== 0 && infos.push({ ...depart, ...this.itataToCity(depart.ds, depart.as) });
        // 添加回程程的航班
        if (this.tripType === 1) {
          const re = this.selectedFlights[1]
          Object.keys(re).length !== 0 && infos.push({ ...re, ...this.itataToCity(re.ds, re.as) });
        }
      }
      return infos;
    },
  },
  methods: {
    flightDate (fDate) {
      let flightDate = new Date(fDate);
      return fDate.slice(-5) + ' ' + getWDMY(flightDate)
    },
    itataToCity (dc, ac) {
      return {
        dc: this.flightsDataConfig.airports[dc].l,
        ac: this.flightsDataConfig.airports[ac].l,
      }
    },
    getData () {
      const sendData = {};
      this.flightInfo.forEach((flightObj, i) => {
        const tmpFlightObj = {
          ...flightObj,
          ...{
            fee: flightObj.fee.fees[0],
            feee: {
              feeStr: flightObj.feee.feeStr,
              feeStrings: [flightObj.feee.feeStrings[0]]
            },
            feeO: {
              obfp: flightObj.fee.obfp,
              ogst: flightObj.fee.ogst,
              bfp: flightObj.fee.bfp - (flightObj.fee.airDt || 0),
              gst: flightObj.fee.gst,
              intervalDiscount: flightObj.fee.dType ? -flightObj.fee.hDt : null,
              airCompanyDiscount: -flightObj.fee.airDt || null
            },
            flightNo: flightObj.fn,
            policyId: flightObj.policyId,
          }
        };
        const name = i === 0 ? 'departFlight' : 'returnFlight';
        sendData[name] = tmpFlightObj;
      })
      sendData.token = this.flightsData.token;
      sendData.requestFromClient = this.searchToQueryObj;
      sendData.returnCash = false;
      sendData.type = 1;
      return sendData;
    },
    flightCheck () {
      this.$http.post(flightCheck, this.getData()).then(res => {
        if (res.code === 0) {
          window.location.href = `/booking/?token=${res.token}`;
        } else {
        }
      })
    },
    showDetailF (flightNo, time, opr, pCount, refund, index) {
      const flightNo2 = flightNo.slice(0, 5)
      if (index === 0) {
        this.showDetailF_0 = !this.showDetailF_0;
        if (this.d_bagInfo.ch !== undefined) return false;
      } else {
        this.showDetailF_1 = !this.showDetailF_1;
        if (this.r_bagInfo.ch !== undefined) return false;
      }

      const url = `?flightNo=${flightNo2}&departDateTime=${time}&discountPrice=${Math.floor(opr / pCount)}&refundable=${refund}&isIntl=${this.isInternational}`;
      return this.$http(fareBaggageQueryUrl + url, this.getData()).then(res => {
        if (index === 0) {
          this.d_bagInfo = res.baggageInfo[flightNo2];
        } else {
          this.r_bagInfo = res.baggageInfo[flightNo2];
        }
      });
    }
  },
  created () {
    if (this.selectedFlights.length === 0) {
      return this.$router.go(-1);
    }
  }
}
</script>
<style lang="scss" scoped>
  .green{
    color: $green;
    font-size: $h5;
  }
  .s-icon{
    vertical-align: middle;
  }
  .s-confirm-general{
    line-height:0.36rem;
    font-size:$h6;
  }
  .s-confirm-general-key{
    width: 30%;
    color:rgba(153,153,153,1);
  }
  .s-confirm-general-val{
    width: 70%;
    color:rgba(17,17,17,1);
    font-size: $h5;
  }
  .confirm-info{
    height:100%;
    overflow-y: scroll;
    padding: 0 0.3rem 1.4rem;
  }
  .confirm-info-title{
    font-size: $h3;
    line-height: 30px;
    color: #666;
    font-weight: 700;
    padding-top: 0.3rem;
  }
  .confirm-info-detail-title{
    font-size:$h2;
    color:rgba(0,0,0,1);
    line-height:0.39rem;
    margin-bottom: 0.21rem;
  }
  .confirm-info-detail-item{
    display: flex;
    margin-bottom: 0.1rem;
  }
  .confirm-info-refund{
    padding: 0.4rem 0 0.5rem;
    font-size: $h5;
    .s-icon-return{
      margin-right: 0.2rem;
    }
  }
  .confirm-info-refundable{
    font-size: $h5;
    color:rgba(227,164,40,1);
    line-height:0.3rem;
    margin-top: 0.3rem;

  }
  .confirm-info-detail-box{
    padding-bottom: 0.3rem;
    border-bottom: 1px solid #DCDCDC;
    &.box_2{
      border: none;
      margin-top: 0.3rem;
      padding-bottom: 0;
    }
  }
  .confirm-info-isShowFliDetail{
    font-size:$h5;
    color:rgba(1,121,89,1);
    line-height:0.27rem;
    text-align: right;
    margin: 0.2rem 0;
  }
  .confirm-info-toBooking{
    position: fixed;
    bottom:0;
    width: 100%;
    padding: 0.28rem 0.45rem;
    display: flex;
    line-height: 0.84rem;
    border-top: 2px solid #DCDCDC;
    position: fixed;
    bottom: 0;
    background: #fff;
  }
  .confirm-info-toBooking-price{
    width: 60%;
  }
  .confirm-info-toBooking-pri{
    font-size:$h1;
    font-weight:700;
    color:rgba(0,0,0,1);
    line-height:0.59rem;
  }
  .confirm-info-toBooking-text{
    font-size: $h6;
    color:rgba(102,102,102,1);
    line-height:0.27rem;
  }
  .confirm-info-toBooking-btn{
    display: inline-block;
    width:2.8rem;
    height:0.84rem;
    line-height: 0.84rem;
    text-align: center;
    background:rgba(227,164,40,1);
    border-radius:0.08rem;
    font-size:$h4;
    font-weight:bold;
    color:rgba(255,255,255,1);
    &:active{
      background:#CB9323;
    }
  }
</style>
