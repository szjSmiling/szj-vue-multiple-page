<template>
<div>
  <div class="otpInputs-wrap">
    <div class="otpInputs">
      <!-- <input v-for="(item, index) in codes"
      class="otpInput"
      :class="{'otpInput-error':error,'active':item.active}"
      v-model="item.code"
      type="text"
      :key="index"
      maxlength="1"
      @keyup="changeCode($event, index)"

      ref="otpInputs"
      /> -->
      <input style="border-bottom:1px solid #999;text-align:center;font-size: 0.36rem;" type="number" v-model="code">
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
      codes: [
        { code: '', active: true },
        { code: '', active: false },
        { code: '', active: false },
        { code: '', active: false }
      ]
    }
  },
  watch: {
    codes: {
      handler (val) {
        const otpCode = val.reduce((code, item) => code + item.code, '')
        this.$emit('getOtpCode', otpCode)
      },
      deep: true
    },
    code (val) {
      if (val) {
        this.code = val.substr(0, 4);
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
    changeCode (e, index) {
      // console.log(e.keyCode);
      if (e.keyCode === 8 || e.keyCode === 46 || e.keyCode === 37) {
        index > 0 && --index;
      } else {
        const code = this.codes[index].code;
        if (/^[0-9]$/g.test(code)) {
          index < this.codes.length - 1 && ++index;
        } else {
          this.$refs.otpInputs[index].value = '';
        }
      }
      this.$refs.otpInputs[index].focus();
    }
  },
  mounted () {
    this.getOtp();
    // this.$refs.otpInputs[0].focus();
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
  }
  .otpInput{
    width:0.9rem;
    color:#111;
    font-size: 0.36rem;
    line-height: 0.35rem;
    text-align: center;
    outline: none;
    border-bottom: 1px solid $lightBlack;
    & +.otpInput{
      margin-left: 0.3rem;
    }
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
