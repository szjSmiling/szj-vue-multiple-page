<template>
  <div class="payment-status-wrap">
    <div class="payment-status-success" v-if="paySucc">
      <p class="payment-status-success-title">Thanks For Booking !</p>
      <p class="payment-status-tips">We have received your order. Flight details will be mailed to your email address within minutes.</p>
    </div>
    <div class="payment-status-wait" v-if="payWait">
      <p class="payment-status-wait-title">Payment Pending !</p>
      <p class="payment-status-tips">Dear customer, we have not received payment confirmation from your payment institution for now.</p>
      <p class="payment-status-tips">Your order will be finished once we have the confirmation. You can check your order status in <a href="/trip" class="a_link">My Trip</a>.</p>
      <p class="payment-status-tips">If we can’t confirm your payment for 30 minutes, we will automatically cancel your order.</p>
    </div>
    <div class="payment-status-fail" v-if="payFail">
      <p class="payment-status-fail-title">Something went wrong !</p>
      <p class="payment-status-tips">Dear customer, your payment for order: {{orderDetail.orderid}} has failed.</p>
      <p class="payment-status-tips">Please check the bank account information and your network connection.</p>
      <p class="payment-status-tips">You can still purchase your flight within 30 minutes without any price change. Click <a href="" class="a_link">here</a> or go to <a href="/trip" class="a_link">My Trip</a> to finish your payment.</p>
    </div>
    <div class="payment-status-info">
      <p class="payment-status-info-title">Order Detail</p>
      <div class="payment-status-detail-info">
        <p class="payment-status-detail-info-item">
          <span>Order ID: </span>
          <a class="a_link" :href="`/trip/detail?tripId=${orderDetail.orderid}&status=${status}`">{{orderDetail.orderid}}</a>
        </p>
        <p class="payment-status-detail-info-item">
          <span>Contact name: </span>
          <span>{{orderDetail.contactName}}</span>
        </p>
        <p class="payment-status-detail-info-item">
          <span>Mobile number: </span>
          <span>{{orderDetail.contactMob}}</span>
        </p>
        <p class="payment-status-detail-info-item">
          <span>E-mail address: </span>
          <span>{{orderDetail.contactEmail}}</span>
        </p>
      </div>
      <p class="payment-status-detail-more" @click="isShowDetail = !isShowDetail">view flight detail
        <i class="s-icon" :class="isShowDetail? 's-icon-up' : 's-icon-down'"></i>
      </p>
      <vertical-toggle>
        <div v-show="isShowDetail">
          <div class="payment-status-detail-more-info">
            <p class="payment-status-detail-info-item">
              <span>Date:</span>
              <span>{{orderDetail.cityAndTime}}</span>
            </p>
            <p class="payment-status-detail-info-item">
              <span>From: </span>
              <span>{{orderDetail.from}}</span>
            </p>
            <p class="payment-status-detail-info-item">
              <span>To: </span>
              <span>{{orderDetail.to}}</span>
            </p>
            <p class="payment-status-detail-info-item">
              <span>Traveler: </span>
              <span>{{orderDetail.strTraveller}}</span>
            </p>
            <p class="payment-status-detail-info-item">
              <span>Cabin Class: </span>
              <span>{{orderDetail.cabinClass}}</span>
            </p>
          </div>
        </div>
      </vertical-toggle>
    </div>
    <div class="payment-status-info-support">
      <p class="payment-status-detail-info-item">24/7 Support</p>
      <p class="payment-status-detail-info-item">
        <span>Tel: </span>
        <span v-if="website">{{website.websitePhone | splitPhone}}</span>
      </p>
      <p class="payment-status-detail-info-item">
        <span>Email:</span>
        <span>cs@happpeasygo.com</span>
      </p>
    </div>
    <div class="payment-status-detail-info-srcad">
      <a :href="advImg.href">
        <img v-if="advImg.url" :src="advImg.url" alt="" class="">
      </a>
    </div>
    <div class="text-align">
      <a href="/" class="payment-status-go-home">Back to Home</a>
    </div>
    <Foot />
  </div>
</template>
<script>
import VerticalToggle from '@/utils/vertical-toggle.js';
import { hasItem, getItem } from '@/utils/CookieUtils';
import { getAdvertising, queryOrderDetail } from '@/constants/ApiConstants';
export default {
  name: 'Home',
  components: {
    VerticalToggle,
    Foot: () => import('@/components/Foot.vue')
  },
  data () {
    return {
      timer: null,
      times: 0,
      website: null,
      isShowDetail: false,
      paySucc: false,
      payWait: false,
      payFail: false,
      status: 2,
      orderDetail: {},
      advImg: {}
    };
  },
  methods: {
    getDetail (data) {
      const { contactEmail, contactMob, contactName } = data.triplist[0];
      const departFlight = data.triplist[0].voyageinfo[0];
      // 单程，往返人数一样 所以取第一单程
      const travellerinfo = data.triplist[0].travellerinfo;
      const numAdult = travellerinfo.filter(v => v.passengerType === 1).length;
      const numChild = travellerinfo.filter(v => v.passengerType === 2).length;
      const numInfant = travellerinfo.filter(v => v.passengerType === 3).length;

      let strTraveller = `${numAdult} ${numAdult > 1 ? 'Adults ' : 'Adult '}`
      strTraveller += numChild > 0 ? numChild + (numChild > 1 ? 'Childs ' : 'Child ') : '';
      strTraveller += numInfant > 0 ? numInfant + (numInfant > 1 ? 'Infants ' : 'Infant ') : '';

      // 获取时间和城市
      let cityAndTime = `${departFlight.dt.slice(0, -6)}(${departFlight.ds})`;
      if (data.triplist.length === 2) {
        const reutnFlight = data.triplist[1].voyageinfo[0];
        cityAndTime += ` - ${reutnFlight.dt.slice(0, -6)}(${reutnFlight.ds}), Round trip`
      }
      // 获取城市
      const from = `${departFlight.dc}(${departFlight.ds})`;
      const arriveFlight = data.triplist[0].voyageinfo[data.triplist[0].voyageinfo.length - 1]
      const to = `${arriveFlight.ac}(${departFlight.as})`;

      this.orderDetail = { ...data.order, ...{ contactEmail, contactMob, contactName, cityAndTime, from, to, strTraveller } };
    },
    getOrder () {
      this.$http(`${queryOrderDetail}?orderId=${this.$route.query.orderId}&phoneNo=${this.$route.query.phoneNo}`).then(res => {
        if (res.code === 0) {
          this.getDetail(res.data);
          let numPayStatus = res.data.triplist[0].payStatus;
          if (numPayStatus === 0) {
            this.payWait = true;
            this.status = 2;
            if (this.times >= 12) {
              clearTimeout(this.timer);
              return false;
            }
            this.timer = setTimeout(() => {
              this.getOrder();
            }, 15000);
            this.times++;
          } else if (
            numPayStatus === 9 ||
            numPayStatus === 3 ||
            numPayStatus === 4
          ) {
            clearTimeout(this.timer);
            this.status = 2;
            this.payFail = true;
          } else {
            clearTimeout(this.timer);
            this.status = 1;
            this.paySucc = true;
            location.replace(`${location.origin}/trip/detail?tripId=${res.data.order.orderid}&status=${this.status}`);
          }
        }
      })
    },
    getAdvImage () {
      let url = `${getAdvertising}?type=34&device=0&businessType=1&platform=${hasItem('platform') ? getItem('platform') : '065626cf-a5a9-4ae8-ba71-ed5f4b8b748d'}`
      this.$http(url, {
        headers: {
          'x-Device': 'msite'
        }
      }).then(res => {
        if (res.success && res.list instanceof Array && res.list.length > 0) {
          this.advImg = res.list[0];
        }
      })
    },
    getWebsiteInfo () {
      this.$http('/heg_api/getWebsiteInfo.do').then(res => {
        if (res.code === 0) {
          this.website = res.webSiteInfo;
        }
      })
    }
  },
  created () {
    this.getWebsiteInfo();
    this.getAdvImage();
    this.getOrder();
  },
  filters: {
    splitPhone (val) {
      let data;
      if (val.indexOf('/')) {
        data = val.split('/')[0] + ' / ' + val.split('/')[1];
      } else {
        data = val;
      }
      return data;
    }
  },
  beforeDestroy () {
    clearTimeout(this.timer);
  }
};
</script>
<style lang="scss" scoped>
  .text-align{
    text-align: center;
  }
  .a_link{
    color: $green;
    text-decoration: underline;
  }
  .payment-status-success,
  .payment-status-wait,
  .payment-status-fail{
    padding: 0.1rem  0.3rem;
  }

  .payment-status-success-title{
    font-size:0.34rem;
    font-weight:bold;
    color:rgba(1,121,89,1);
    line-height:0.48rem;
  }
  .payment-status-wait-title{
    font-size:0.34rem;
    font-weight:bold;
    line-height:0.48rem;
    color:rgba(227,164,40,1);
  }
  .payment-status-tips{
    font-size:0.24rem;
    color:rgba(102,102,102,1);
    line-height:0.36rem;
    margin: 0.2rem 0;
  }
  .payment-status-fail-title{
    font-size:0.34rem;
    font-weight:bold;
    color:rgba(189,0,0,1);
    line-height:0.43rem;
  }
  .payment-status-info{
    border-bottom: 1px solid #DCDCDC;
    padding: 0  0.3rem 0.4rem;
  }
  .payment-status-info-title{
    font-size:0.28rem;
    font-weight:bold;
    color:rgba(102,102,102,1);
    line-height:0.35rem;
    margin-bottom: 0.2rem;
  }
  .payment-status-detail-info-item{
    font-size:0.24rem;
    color:rgba(102,102,102,1);
    line-height:0.3rem;
    margin: 0.1rem;
  }
  .payment-status-detail-more{
    font-size:0.24rem;
    color:$green;
    line-height:0.3rem;
    margin: 0.3rem 0 0;
    .s-icon{
      margin-left: 0.1rem;
    }
  }
  .payment-status-detail-more-info{
    padding-top: 0.2rem;
  }
  .payment-status-info-support{
    padding: 0.3rem 0.3rem 0.4rem;
  }
  .payment-status-detail-info-srcad{
    width: 100%;
    height:1.8rem;
    text-align: center;
    a, img{
      width:100%;
      height:100%;
      &:active{
        filter: saturate(50%);
      }
    }
  }
  .payment-status-go-home{
    display: inline-block;
    width:6.2rem;
    height:0.9rem;
    background:rgba(227,164,40,1);
    border-radius:0.12rem;
    margin: 0.4rem 0 0.6rem;
    font-size:0.36rem;
    font-weight:bold;
    color:rgba(255,255,255,1);
    line-height:0.9rem;
    &:active{
      background:#CB9323;
    }
  }
</style>
