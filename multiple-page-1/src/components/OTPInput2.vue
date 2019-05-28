<template>
  <div>
    <div class="otpInputs-wrap">
      <div class="otpInputs">
        <input v-enterfocus ref="otpInputs" type="number" v-model="code" @keydown.delete="changeCode">
        <span class="code_list">{{code1}}</span>
        <span class="code_list">{{code2}}</span>
        <span class="code_list">{{code3}}</span>
        <span class="code_list last_code_list">{{code4}}</span>
      </div>
      <div class="otpInputs-error" :class="{'otpInputs-error-active': error}">
        please enter correct OTP
      </div>
    </div>
    <div class="otpInputs_resend">
      <button class="otpInputs_resend-btn"
        :class="{'otpInputs_resend-btn-disabled':restTime > 0}"
        role="button"
        @click="getOtp"
        :disabled="restTime > 0"
        >
        {{restTime > 0 ? `Resend ${restTime}`: 'Resend'}}
      </button>
    </div>
  </div>
</template>
<script>
import { Toast, Indicator } from 'mint-ui';

export default {
  props: {
    getOtpUrl: String,
    error: Boolean,
  },
  data () {
    return {
      restTime: 0,
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
        this.$emit('getOtpCode', this.code);
      }
    }
  },
  methods: {
    getOtp () {
      Indicator.open({
        text: 'Sending...',
        spinnerType: 'fading-circle'
      });
      this.$refs.otpInputs.focus();
      this.$http(this.getOtpUrl).then(res => {
        Indicator.close();
        if (res.success && res.lastSendTime) {
          this.restTime = res.lastSendTime;
          var timer = setInterval(() => {
            this.restTime--;
            if (this.restTime <= 0) {
              this.restTime = 0;
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
    }
  },
  mounted () {
    this.getOtp();
    this.$refs.otpInputs.focus();
  },
  directives: {
    enterfocus: {
      inserted: function (el) {
        el.focus();
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .otpInputs-wrap{
    margin-bottom: 0.6rem;
    &::after{
      content:'';
      clear: both;
    }
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
    border-bottom:1px solid #999;
  }
  .last_code_list{
    margin-right: 0;
  }
  //
  .otpInput{
    width:0.9rem;
    color:#111;
    font-size: 0.36rem;
    line-height: 0.35rem;
    text-align: center;
    outline: none;
    border-bottom: 1px solid $lightBlack;
  }
  .otpInput-error{
    // color: rgba(189,0,0,1);
    border-bottom-color:rgba(189,0,0,1);
  }
  .otpInputs-error{
    color:rgba(189,0,0,1);
    text-align: center;
    font-size: 0.22rem;
    visibility: hidden;
  }
  .otpInputs-error-active{
    visibility:visible;
  }
  .otpInputs_resend{
    display: flex;
    justify-content: flex-end;
    margin-bottom: 0.6rem;
  }
  .otpInputs_resend-btn{
    color:#111;
    font-size: 0.24rem;
    font-weight: bold;
    background: transparent;
  }
  .otpInputs_resend-btn-disabled{
    color:$lighterBlack;
    font-weight: normal;
    letter-spacing: 0.5px;
  }
</style>
