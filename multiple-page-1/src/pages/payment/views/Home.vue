<template>
  <div class="pay_box">
    <paymentInfo v-show="!clickPayment" :orderId="orderId" :totalAmount="totalAmount"></paymentInfo>
    <paymentMethod v-show="!clickPayment" :paymentChannel="paymentChannel" :orderId="orderId" ></paymentMethod>
    <div class="confirm_paying" v-show="clickPayment">
      <img :src="require('../images/pay_logo.png')" alt="">
      <div class="confirm_text">
        <p>Confirming Payment</p>
        <div class="confirm_loading">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
    <Foot />
  </div>
</template>
<script>
import paymentInfo from './paymentInfo';
import paymentMethod from './paymentMethod';
import { Toast, Indicator } from 'mint-ui';
import EventHub from '@/utils/EventHub';
import { queryOrderDetail, queryPaymentChannel } from '@/constants/ApiConstants';
export default {
  props: ['orderId', 'phoneNo'],
  data () {
    return {
      totalAmount: '',
      clickPayment: false,
      paymentChannel: []
    };
  },
  methods: {
    queryOrderDetail () {
      let url = `${queryOrderDetail}?orderId=${this.orderId}&phoneNo=${this.phoneNo}`;
      return new Promise((resolve, reject) => {
        this.$http(url).then(res => {
          if (res.code === 0 && res.data) {
            resolve(res);
          } else {
            Toast(res.message);
            reject(res);
          }
        })
      })
    },
    queryPaymentChannel () {
      let url = `${queryPaymentChannel}`;
      return new Promise((resolve, reject) => {
        this.$http(url, {
          headers: {
            'x-Device': 'mobile'
          }
        }).then(res => {
          if (res.success && res.channel instanceof Array && res.channel.length > 0) {
            resolve(res);
          } else {
            Toast(res.content);
            reject(res);
          }
        })
      })
    }
  },
  components: {
    paymentInfo,
    paymentMethod,
    Foot: () => import('@/components/Foot.vue')
  },
  created () {
    EventHub.$on('clickConfirm', (data) => {
      this.clickPayment = data;
    });
    Indicator.open({
      spinnerType: 'fading-circle'
    });
    Promise.all([ // if success ,returns an array in request order.
      this.queryOrderDetail(),
      this.queryPaymentChannel()
    ]).then(res => {
      Indicator.close();
      this.totalAmount = res[0].data.order.payamount;
      this.paymentChannel = res[1];
    })
  }
};
</script>
<style lang="scss" scoped>
.pay_box{
  // height:calc( 100% - 1.2rem);
  height: 100%;
  position: relative;
}
.pay_box .home-logo{
  position: fixed;
  bottom: 0;
  left: 0;
}
.confirm_paying{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height:calc( 100% - 0.98rem);
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  background: #f1f1f1;
  img{
    width:1.8rem;
    height:0.8rem;
  }
  .confirm_text{
    p{
      font-size: 0.28rem;
      color:rgba(0,0,0,1);
      line-height:0.3rem;
      letter-spacing: 0.5px;
      margin-top: 0.2rem;
      margin-bottom: 0.3rem;
      text-align: center;
    }
  }
}
.confirm_loading span{
  display: inline-block;
  width:10px;
  height:10px;
  margin-right: 5px;
  border-radius: 50%;
  background: lightgreen;
  animation: load 1.5s cubic-bezier(1,1,0,0) infinite;
}
.confirm_loading{
  line-height: 10px;
  text-align: center;
}
.confirm_loading span:last-child{
  margin-right: 0;
}
@keyframes load{
  0% {
    opacity:1;
    transform: scale(1);
  }
  100% {
    opacity:0;
    transform: scale(0);
  }
}
.confirm_loading span:nth-child(1){
  background: #017959;
  animation-delay:0.15s;
}
.confirm_loading span:nth-child(2){
  background: #E3A428;
  animation-delay:0.3s;
}
.confirm_loading span:nth-child(3){
  background: #12355D
;
  animation-delay:0.45s;
}
.confirm_loading span:nth-child(4){
  background: #CC4747;
  animation-delay:0.6s;
}
</style>
