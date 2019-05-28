<template>
  <div class="login">
    <div class="login-tabs">
      <div class="login-tab" v-if="isTab1">
        <div class="login-tabs-title">
          Enter Phone Number or Email
        </div>
        <div class="login-tab-inputs">
          <PhonePrefix @getPhonePrefix="getPhonePrefix" v-show="isPhoneNo" class="phone__prefix"/>
          <input class="login-tab-input" :class="{phonePrefixPad: isPhoneNo}" @keyup="checkContact($event)" :value="contact" type="text">
        </div>
        <p class="login-tab-note"><i class="s-icon s-icon-note"></i>Please enter the contact info you use while booking.</p>
      </div>
      <div class="login-tab" v-if="!isTab1">
        <div class="login-tabs-title">
          OTP has been sent to
        </div>
        <div class="login-tabs-contact">
          {{isPhoneNo? phonePrefix : ''}} {{contact}}
        </div>
        <div class="login-tabs-note">
          Please enter code below
        </div>
        <OTPInput
        :getOtpUrl="getOtpUrl"
        :error="otpError"
        @getOtpCode="getOtpCode"
        />
      </div>
    </div>
    <div class="login-btn" @click="check" role="button">
      {{isTab1 ? 'Continue' : 'Verify'}}
    </div>
  </div>
</template>
<script>
import OTPInput from '@/components/OTPInput2';
import { getOrderToken, getTokenOtp } from '@/constants/ApiConstants';
import * as reg from '@/constants/RegularConstants';
import { Toast } from 'mint-ui';
import PhonePrefix from '@/components/PhonePrefix';
export default {
  components: {
    OTPInput,
    PhonePrefix,
  },
  data () {
    return {
      isTab1: true, // 页面tab 切换
      contact: '',
      contactType: 1,
      otpError: false,
      otpCode: '',
      isPhoneNo: false, // 是phone no 要加国际区号
      phonePrefix: '', // 国际区号
    }
  },
  computed: {
    getOtpUrl () {
      return `${getTokenOtp}?emailOrPhone=${this.isPhoneNo ? this.phonePrefix + ' ' + this.contact : this.contact}&type=${this.contactType}`;
    }
  },
  methods: {
    getPhonePrefix (phonePrefix) {
      this.phonePrefix = phonePrefix;
    },
    checkContact (e) {
      const value = e.target.value;
      // const inputArray = value.split(' ');
      // 如果输入框大部分是数字就加 区号
      // if (/^[0-9]{6,16}$/.test(inputArray[inputArray.length - 1])) {
      //   if (inputArray.length === 1) {
      //     // e.target.value = '+91 ' + value;
      //   }
      // } else if (value.length > 12) {
      //   e.target.value = inputArray[inputArray.length - 1];
      // }
      if (/^[0-9]{6,16}$/.test(value)) {
        this.isPhoneNo = true;
      } else {
        this.isPhoneNo = false;
      }
      this.contact = e.target.value;
    },
    check () {
      // continue 操作
      if (this.isTab1) {
        if (reg.email.test(this.contact)) {
          this.contactType = 2;
          this.isTab1 = false;
        } else if (reg.mobile.test(this.contact)) {
          this.contactType = 1;
          this.isTab1 = false;
        } else {
          Toast({
            message: 'Phone Number or Email has error',
            duration: 2000
          })
        }
      } else {
        if (!/\d{4}/.test(this.otpCode)) {
          this.otpError = true;
          return;
        }
        const params = `?emailOrPhone=${this.contactType === 1 ? this.phonePrefix + ' ' + this.contact : this.contact}&otpCode=${this.otpCode}&type=${this.contactType}`;
        this.$http(getOrderToken + params, {
          headers: {
            'x-Device': 'mobile'
          }
        }).then(res => {
          if (res.succ) {
            this.$store.commit('setAuthToken', res.token);
            this.$store.commit('setUserPhoneOrEmail', this.contactType === 1 ? '+' + this.phonePrefix + ' ' + this.contact : this.contact);
            this.$router.replace(this.$route.query.redirect);
          } else {
            this.otpError = true;
          }
        })
      }
    },
    getOtpCode (code) {
      this.otpCode = code;
    }
  }
}
</script>

<style lang="scss" scoped>

$phonePrefixWidth: 1.5rem;
.login{
  padding: 0 0.3rem;
}
.login-tabs{
  margin-bottom: 0.6rem;
  margin-top: 0.3rem;
}
.login-tab-note{
  padding-top: 0.3rem;
}
.login-tabs-title{
  margin-bottom: 0.2rem;
}
.login-tabs-contact{
  font-weight:bold;
  font-size: 0.28rem;
}
.login-tab-note{
  font-size:0.22rem;
  color:#787878;
  line-height: 0.3rem;
  margin-bottom: 0.6rem;
  i{
    margin-right: 0.1rem;
    vertical-align: middle;
  }
}
.login-tab-inputs{
  position: relative;
}
.phone__prefix{
  display: flex;
  width:$phonePrefixWidth;
  height: 100%;
  align-items: center;
  justify-content: space-around;
  color: #666;
  font-weight: bold;
  font-size: 0.28rem;
}
.login-tab-input{
  width:6.6rem;
  height:0.68rem;
  padding: 0 6px;
  font-size: 0.28rem;
  font-weight: bold;
  color: #111;
  background:rgba(250,250,250,1);
  border-radius:0.08rem;
  border:1px solid rgba(220,220,220,1);
  &.phonePrefixPad{
    padding-left: $phonePrefixWidth;
  }
  &:focus{
    border:1px solid rgba(1,121,89,1);
  }
}
.login-btn{
  width:6.2rem;
  height:0.9rem;
  font-weight:bold;
  color: #fff;
  text-align: center;
  line-height: 0.9rem;
  background:rgba(227,164,40,1);
  border-radius:0.12rem;
  font-size:0.36rem;
  &:active{
    background:#CB9323;
  }
}
</style>
