<template>
  <div class="gst-info">
    <div class="gst-info-title">
      <label> <i class="s-icon contacts-info-gst-check"
      :class="ischecked ? 's-icon-select' : 's-icon-unselect'"></i> I have GST number (optional)
      <input type="checkbox" v-model="ischecked" class="contacts-info-gst-input hide">
      </label>
    </div>
    <div class="gst-info-items" v-show="ischecked">
      <div class="gst-info-item">
        <label class="gst-info-label">GST Number</label>
        <input type="text" name="gstNumber" v-model="gstInfo.registrationNumber"
        class="gst-info-input"
        :class="{'red-border': errors.has('gstNumber')}"
        v-validate="'required|gstNumber'"
        @focus="inputFocus('gstNumber')"
        @blur="inputBlur('contactName')">
        <span class="errorText" :class="focusInput === 'gstNumber' ? 'hide' : '' " v-show="errors.has('gstNumber')">{{ errors.first('gstNumber') }}</span>
      </div>
      <div class="gst-info-item">
        <label class="gst-info-label">Company Name</label>
        <input type="text" name="companyName"
        v-model="gstInfo.registeredCompanyName"
        class="gst-info-input"
        :class="{'red-border': errors.has('companyName')}"
        v-validate="'required|companyName'"
        @focus="inputFocus('companyName')"
        @blur="inputBlur('companyName')">
        <span class="errorText" :class="focusInput === 'companyName' ? 'hide' : '' " v-show="errors.has('companyName')">{{ errors.first('companyName') }}</span>
      </div>
      <div class="gst-info-item">
        <label class="gst-info-label">Business Email ID</label>
        <input type="text"
        name="email"
        v-model="gstInfo.email"
        class="gst-info-input"
        :class="{'red-border': errors.has('email')}"
        v-validate="'required|email'"
        @focus="inputFocus('email')"
        @blur="inputBlur('email')">
        <span class="errorText" :class="focusInput === 'companyName' ? 'hide' : '' " v-show="errors.has('email')">{{ errors.first('email') }}</span>
      </div>
      <div class="gst-info-item">
        <label class="gst-info-label">Company Address</label>
        <input type="text" name="address" v-model="gstInfo.registeredCompanyAddress"
        class="gst-info-input"
        :class="{'red-border': errors.has('address')}"
        v-validate="'required|max:200'"
        @focus="inputFocus('address')"
        @blur="inputBlur('address')">
        <span class="errorText" :class="focusInput === 'address' ? 'hide' : '' " v-show="errors.has('address')">{{ errors.first('address') }}</span>
      </div>
      <div class="gst-info-item">
        <label class="gst-info-label">Phone Number</label>
        <input type="text"
        name="phoneNumber"
        v-model="gstInfo.phone"
        class="gst-info-input"
        :class="{'red-border': errors.has('phoneNumber')}"
        v-validate="'required|phoneNo'"
        @focus="inputFocus('address')"
        @blur="inputBlur('phoneNumber')">
        <span class="errorText" :class="focusInput === 'phoneNumber' ? 'hide' : '' " v-show="errors.has('phoneNumber')">{{ errors.first('phoneNumber') }}</span>
      </div>
      <div class="gst-info-item">
        <label class="gst-info-label">City</label>
        <input type="text" name="city"
        v-model="gstInfo.state"
        class="gst-info-input"
        :class="{'red-border': errors.has('city')}"
        v-validate="'required|max:50'"
        @focus="inputFocus('city')"
        @blur="inputBlur('city')">
        <span class="errorText" :class="focusInput === 'city' ? 'hide' : '' " v-show="errors.has('city')">{{ errors.first('city') }}</span>
      </div>
    </div>
  </div>
</template>
<script>
import { mapMutations } from 'vuex';
import EventHub from '@/utils/EventHub';

export default {
  data () {
    return {
      gstInfo: {
        country: 'India',
        email: '',
        phone: '',
        registeredCompanyAddress: '',
        registeredCompanyName: '',
        registrationNumber: '',
        state: 'Haryana'
      },
      focusInput: ''
    }
  },
  computed: {
    ischecked: {
      get () {
        return this.$store.state.isGst;
      },
      set (val) {
        this.changeGst(val);
      }
    }
  },
  methods: {
    ...mapMutations(['changeGst', 'setGstInfo']),
    inputFocus (name) {
      this.focusInput = name;
    },
    inputBlur (name) {
      this.focusInput = '';
    }
  },
  created () {
    EventHub.$on('sendGstInfo', res => {
      if (res) {
        this.setGstInfo(this.gstInfo);
      }
    })
  }
}
</script>
<style lang="scss">
  .gst-info-title{
    padding: 0.32rem 0;
    font-size:$h6;
    font-weight:400;
    color:rgba(102,102,102,1);
    line-height:0.3rem;
  }
  .contacts-info-gst-input{
    vertical-align: middle;
    margin-right: 0.2rem;
  }
  .contacts-info-gst-check{
    vertical-align: middle;
    margin-right: 0.1rem;
  }
  .gst-info-item{
    position: relative;
  }
  .gst-info-label{
    font-size: 0.32rem;
    color: #111;
  }
  .gst-info-input{
    display: block;
    width: 100%;
    height: 0.82rem;
    background: #fafafa;
    border-radius: 0.12rem;
    border: 0.01rem solid gainsboro;
    margin: 0.2rem 0;
    padding: 4px 10px;
    &:focus{
      border:0.01rem solid rgba(1,121,89,1);
    }
  }
</style>
