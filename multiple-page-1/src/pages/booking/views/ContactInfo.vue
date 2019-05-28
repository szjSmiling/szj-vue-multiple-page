<template>
  <div class="contact-info">
    <p class="contact-info-title d_jump_contact">Contact Information</p>
      <div class="contacts-info-name">
        <div class="relative">
          <label for="" class="s-contact-general ">Contact Name</label>
          <input type="text"
          name="contactName"
          v-model="contactInfo.contactName"
          class="contacts-info-name-input"
          :class="{'red-border': errors.has('contactName')}"
          v-validate="'required|name'"
          @focus="inputFocus('contactName')"
          @blur="inputBlur('contactName')">
          <span class="errorText" :class="focusInput === 'contactName' ? 'hide' : '' " v-show="errors.has('contactName')">{{ errors.first('contactName') }}</span>
        </div>
        <div class="relative">
          <label for="" class="s-contact-general">Email</label>
          <input type="email"
          name="email"
          v-model="contactInfo.contactEmail"
          class="contacts-info-name-input"
          :class="{'red-border': errors.has('email')}"
          v-validate="'required|email'"
          @focus="inputFocus('email')"
          @blur="inputBlur('email')">
          <span class="errorText" :class="focusInput === 'email' ? 'hide' : '' " v-show="errors.has('email')">{{ errors.first('email') }}</span>
        </div>
      </div>
      <div class="contacts-info-mobile">
        <div class="relative">
          <label class="s-contact-general">Mobile Number</label>
          <div class="contacts-info-mobile-select">
            <div class="contacts-info-mobile-select-regioncode">+ {{regionCode}}
              <select name="regionCode" id="" class="contacts-info-mobile-code" v-model="regionCode" @change="inputChange('regionCode')">
                <option v-for="(code, index) in phoneCode" :key="index" :value="code.regionCode">
                  {{code.countryName}} + ({{code.regionCode}})
                </option>
              </select>
              <i class="s-icon s-icon-datadown"></i>
            </div>
            <input type="number"
            name="phoneNo"
            v-model="contactNumber"
            class="contacts-info-mobile-number"
            :class="{'red-border': errors.has('phoneNo')}"
            v-validate="'required|phoneNo'"
            @focus="inputFocus('phoneNo')"
            @blur="inputBlur('phoneNo')">
          </div>
          <span class="errorText"  v-show="phoneInput === 'phoneNo' ? false : true || errors.has('phoneNo') ">Please enter a valid phoneNo!</span>
        </div>
        <p class="contacts-info-mobile-tips">Ticket info will be sent through email or mobile</p>
      </div>
  </div>
</template>

<script>
import EventHub from '@/utils/EventHub';
import { mobileFindSms } from '@/constants/ApiConstants';
export default {
  data () {
    return {
      ischecked: false,
      phoneCode: [],
      regionCode: '91',
      contactNumber: '',
      focusInput: '',
      phoneInput: 'phoneNo',
      contactInfo: {
        contactEmail: '',
        contactName: ''
      },
    }
  },
  created () {
    this.$http(mobileFindSms).then((res) => {
      this.phoneCode = res.list;
    });
    EventHub.$on('sendContactInfo', (res) => {
      if (res) {
        this.$validator.validateAll().then((result) => {
          if (result) {
            const info = this.contactInfo;
            info.contactMob = this.regionCode + ' ' + this.contactNumber;
            this.$store.commit('setContactInfo', info);
          } else {
            this.scrollToErrDiv(0);
          }
        })
      }
    })
  },
  methods: {
    scrollToErrDiv (index) {
      var top = document.getElementsByClassName('d_jump_contact');
      let that = this;
      cancelAnimationFrame(this.timerScroll);
      this.timerScroll = requestAnimationFrame(function fn () {
        let oTop = document.body.scrollTop || document.documentElement.scrollTop;
        if (oTop > top[index].offsetTop) {
          document.body.scrollTop = document.documentElement.scrollTop = top[index].offsetTop - 50;
          that.timerScroll = requestAnimationFrame(fn);
        } else {
          cancelAnimationFrame(that.timerScroll);
        }
      });
    },
    inputFocus (name) {
      this.focusInput = name;
      if (name === 'phoneNo') {
        this.phoneInput = name;
      }
    },
    inputBlur (name) {
      this.focusInput = '';
      if (name === 'phoneNo') {
        if (this.regionCode === '91') {
          if (this.contactNumber.trim().length === 10) {
            this.phoneInput = name;
          } else {
            this.phoneInput = '';
          }
        } else if (this.regionCode === '86') {
          if (this.contactNumber.trim().length === 11) {
            this.phoneInput = name;
          } else {
            this.phoneInput = '';
          }
        } else {
          this.phoneInput = 'phoneNo';
        }
      }
    },
    inputChange () {
      if (this.regionCode === '91') {
        if (this.contactNumber.trim().length === 10) {
          this.phoneInput = 'phoneNo';
        } else {
          this.phoneInput = '';
        }
      } else if (this.regionCode === '86') {
        if (this.contactNumber.trim().length === 11) {
          this.phoneInput = 'phoneNo';
        } else {
          this.phoneInput = '';
        }
      } else {
        this.phoneInput = 'phoneNo';
      }
    }
  }
}
</script>

<style scoped lang='scss'>
  .relative{
    position: relative;
  }
  .s-contact-general{
    font-size: $h4;
    color: #111;
  }
  .contact-info-title{
    font-size: $h4;
    line-height: 0.6rem;
    color: $lightBlack;
    font-weight: 700;
    margin-bottom: 5px;
  }
  .contacts-info-name-input{
    display: block;
    width: 100%;
    height:0.82rem;
    background:rgba(250,250,250,1);
    border-radius:0.12rem;
    border:0.01rem solid rgba(220,220,220,1);
    margin: 0.2rem 0;
    padding: 4px 10px;
    &:focus{
      border:0.01rem solid rgba(1,121,89,1);
    }
  }
  .contacts-info-mobile-select{
    display: flex;
    margin: 0.2rem 0;
  }
  .contacts-info-mobile-select-regioncode{
    width:1.6rem;
    height:0.82rem;
    background:rgba(250,250,250,1);
    border-radius:0.12rem;
    border:0.01rem solid rgba(220,220,220,1);
    margin-right: 0.28rem;
    padding: 0.2rem 0.2rem 0.2rem 0.1rem;
    position: relative;
    line-height: 0.42rem;
    .s-icon{
      position: absolute;
      right: 0.1rem;
      top: 0.35rem;
    }
  }
  .contacts-info-mobile-code{
    width: 100%;
    height: 100%;
    opacity: 0;
    position: absolute;
    left: 0;
    top: 0;
  }
  .contacts-info-mobile-number{
    width:4.93rem;
    height:0.82rem;
    background:rgba(250,250,250,1);
    border-radius:0.12rem;
    border:0.01rem solid rgba(220,220,220,1);
    padding: 0.12rem 0.2rem;
    &:focus{
      border:0.01rem solid rgba(1,121,89,1);
    }
  }
  .contacts-info-mobile-tips{
    font-size:0.22rem;
    color:rgba(102,102,102,1);
    line-height:0.27rem;
  }

</style>
