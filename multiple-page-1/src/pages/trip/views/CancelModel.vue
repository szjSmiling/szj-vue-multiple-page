<template>
  <div class="cancel_model">
    <div class="cancel_content">
      <p class="cancel_title">Are you sure you want to cancel your order?</p>
      <button class="cancel_btn" @click="confirmCancel">Yes, cancel my order</button>
      <button class="no_cancel_btn" @click="keepMyOrder">No, keep my order</button>
    </div>
  </div>
</template>
<script>
import EventHub from '@/utils/EventHub';
// import { getItem } from '@/utils/CookieUtils';
import { padZero } from '@/utils/NumberUtils';
import { cancelOrderByGuest } from '@/constants/ApiConstants';
import { Toast } from 'mint-ui';
export default {
  props: ['flightOrderIdString'],
  methods: {
    confirmCancel () {
      let data = {
        id: this.flightOrderIdString,
        cancelReason: '6',
        date: `${new Date().getFullYear()}${padZero(new Date().getMonth() + 1)}${padZero(new Date().getDate())}`,
        operatorType: 2,
        route: 1,
        userName: localStorage.account ? JSON.parse(localStorage.getItem('account')) : ''
      };
      this.$http.post(cancelOrderByGuest, data).then(res => {
        if (res.code === 200 && res.data) {
          EventHub.$emit('hideCancelModelSucc');
          Toast({
            message: 'Cancel Successfully',
            duration: 1500
          });
          this.$router.replace({
            path: '/tripback',
          })
        } else {
          Toast({
            message: res.msg
          });
        }
      })
    },
    keepMyOrder () {
      EventHub.$emit('hideCancelModel');
    }
  }
}
</script>
<style lang="scss" scoped>
.cancel_model{
  position: absolute;
  width:100%;
  height:100%;
  z-index: 10;
  top: 0;
  left: 0;
  background: rgba(0,0,0,0.7);
}
.cancel_content{
  width:6.4rem;
  background: #fff;
  border-radius: 0.12rem;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding:0.6rem 0.6rem 0.4rem;
}
.cancel_title{
  color:#111;
  font-size: 0.28rem;
  line-height: 0.42rem;
  margin-bottom: 0.6rem;
  text-align: center;
}
.cancel_btn{
  display: block;
  width:4.8rem;
  height:0.68rem;
  color:#fff;
  font-size: 0.28rem;
  font-weight: bold;
  margin:0 auto 0.29rem;
  background: $yellow;
  border-radius:0.12rem;
  &:active{
    background:#CB9323;
  }
}
.no_cancel_btn{
  display: block;
  width:3.5rem;
  color:$lighterBlack;
  font-size: 0.28rem;
  line-height: 0.35rem;
  margin:auto;
  background: transparent;
}
</style>
