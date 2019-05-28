<template>
  <div class="send_otp">
    <h3 class="cancel_otp_title">Cancel Trip</h3>
    <p class="cancel_otp_des">Confirm code has been sent to {{contactPhone | keepSecrect}}</p>
    <p class="cancel_otp_des">Please enter the confirm code to continue.</p>
    <div class="cancel_otp_code_box">
      <div class="otpInputs">
        <input v-enterfocus ref="otpInputs" type="number" v-model="code" @keydown.delete="changeCode">
        <span class="code_list">{{code1}}</span>
        <span class="code_list">{{code2}}</span>
        <span class="code_list">{{code3}}</span>
        <span class="code_list last_code_list">{{code4}}</span>
      </div>
      <p class="error_text" :class="{show: error}">Please try again</p>
    </div>
    <div class="clear">
      <button class="cancel_otp_resend" :class="{disabled:disabled && restTime > 0}" :disabled="disabled" @click="startSendOTP">
        {{disabled && restTime > 0?`Resend ${restTime}s`:'Resend'}}
      </button>
    </div>
    <h4 class="cancel_warning_title">Warning</h4>
    <p class="cancel_warning_des">
      Your booking will be cancelled and the refundable amount is 0/per passenger. Our system will cancel your booking automatically regardless of the refundable amount. Are you sure to proceed?
    </p>
    <button class="cancel_confirm_btn" @click="confirmCancel">Yes,Cancel Trip</button>
    <button class="cancel_not_confirm_btn" @click="giveUpCancel">No,Keep My trip</button>
  </div>
</template>
<script>
import { Toast, Indicator } from 'mint-ui';
import { getRefundOTP, applyForRefundTogether } from '@/constants/ApiConstants';
export default {
  props: ['OTPdata', 'contactPhone', 'tripId'],
  data () {
    return {
      flag: 0,
      restTime: 0,
      error: false,
      disabled: true,
      code: '',
      code1: '',
      code2: '',
      code3: '',
      code4: '',
    }
  },
  watch: {
    code (val) {
      if (val) {
        this.code = val.length > 4 ? val.substr(0, 4) : val;
        let arr = val.split('');
        this.code1 = arr[0];
        this.code2 = arr[1];
        this.code3 = arr[2];
        this.code4 = arr[3];
      }
    }
  },
  methods: {
    startSendOTP () {
      Indicator.open({
        text: 'Sending...',
        spinnerType: 'fading-circle'
      });
      let url = `${getRefundOTP}?tripId=${this.tripId}`
      this.$http(url).then(res => {
        Indicator.close();
        if (res.success && res.lastSendTime) {
          this.restTime = res.lastSendTime;
          this.disabled = true;
          var timer = setInterval(() => {
            this.restTime--;
            if (this.restTime <= 0) {
              this.restTime = 0;
              this.disabled = false;
              clearInterval(timer);
            }
          }, 1000);
        } else {
          Toast(res);
        }
      })
    },
    changeCode (e) {
      if (this.code.split('').length <= 1) {
        this.code = '';
        this.code1 = '';
      }
      this.$refs.otpInputs.focus();
    },
    confirmCancel () {
      let data = this.OTPdata;
      data['otp'] = `${this.code1}${this.code2}${this.code3}${this.code4}`;
      this.$http.post(applyForRefundTogether, data).then(res => {
        if (res.code === 200 && res.succ) {
          this.error = false;
          Toast('Cancel Successfully');
          this.$emit('cancelSuccess');
        } else {
          this.error = true;
          Toast(res.msg);
        }
      })
    },
    giveUpCancel () {
      this.$emit('giveUpCancel');
    }
  },
  filters: {
    keepSecrect (val) {
      let phone = val.split(' ');
      let head = phone[1].substr(0, 3);
      let tail = phone[1].substr(-3);
      return `${phone[0]} ${head}****${tail}`;
    }
  },
  directives: {
    enterfocus: {
      inserted: function (el) {
        el.focus();
      }
    }
  },
  created () {
    this.startSendOTP();
  },
  mounted () {
    this.$refs.otpInputs.focus();
  }
}
</script>
<style lang="scss" scoped>
.send_otp{
  margin-top:0.3rem;
}
.cancel_otp_title{
  font-size: 0.28rem;
  height:0.31rem;
  color:$lightBlack;
  line-height: 0.35rem;
  margin-bottom: 0.3rem;
  font-weight: bold;
}
.cancel_otp_des{
  font-size: 0.28rem;
  height:0.42rem;
  color:#333;
  line-height: 0.42rem;
}
// code
.cancel_otp_code_box{
  margin:0.6rem 0 0.4rem;
  text-align: center;
}
.otpInputs{
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.1rem;
  position: relative;
  input{
    display: block;
    width:100%;
    height:0.4rem;
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
  }
}
//
.code_list{
  display: inline-block;
  width:0.8rem;
  height:0.4rem;
  line-height:0.4rem;
  margin-right: 0.5rem;
  text-align: center;
  font-size: 18px;
  border-bottom:1px solid #999;
}
.last_code_list{
  margin-right: 0;
}
.code_error{
  border-color:#BD0000;
}
.error_text{
  width:3rem;
  height:0.21rem;
  margin:0.2rem auto 0;
  font-size:0.22rem;
  color:rgba(189,0,0,1);
  line-height:0.22rem;
  opacity: 0;
}
.show{
  opacity: 1;
}
.active{
  border-color:$green;
}
.cancel_otp_code_input:nth-of-type(-n+3){
  margin-right: 0.3rem;
}
.cancel_otp_resend{
  float: right;
  height:0.42rem;
  color:#111;
  font-size: 0.24rem;
  font-weight: bold;
  line-height: 0.42rem;
  cursor: pointer;
  background: transparent;
  margin-bottom: 0.6rem;
}
.disabled{
  color:$lighterBlack;
  font-weight: normal;
  letter-spacing: 0.5px;
}
// warning
.cancel_warning_title{
  font-size: 0.28rem;
  height:0.27rem;
  color:$lightBlack;
  line-height: 0.3rem;
  margin-bottom: 0.2rem;
  font-weight: bold;
}
.cancel_warning_des{
  font-size: 0.22rem;
  color:$lighterBlack;
  line-height: 0.33rem;
  margin-bottom: 0.6rem;
}
.cancel_confirm_btn{
  display: block;
  width:6.2rem;
  height:0.9rem;
  color:#fff;
  font-weight: bold;
  font-size: 0.36rem;
  line-height: 0.9rem;
  background: $yellow;
  margin:0 auto 0.3rem;
  border-radius:0.12rem;
  &:active{
    background:#CB9323;
  }
}
.cancel_not_confirm_btn{
  display: block;
  width:2.07rem;
  color:#111;
  font-size: 0.24rem;
  margin:0 auto;
  background: transparent;
}
</style>
