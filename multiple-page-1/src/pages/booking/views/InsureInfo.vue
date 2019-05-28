<template>
  <div class="insure-info">
    <div>
      <p class="insure-info-title">Secure Your Trip</p>
      <p class="insure-info-tips">96% of our customers insure their trip. See all the benefits you get for just
        <!-- <span class="line-through">Rs.{{insurance.orignPirce}} </span> -->
        <span>Rs.{{insurance.price}}</span>
        <span v-show="flightInfo.isIntl">per persion</span>
      </p>
      <div class="insure-info-details" :class="isChecked ? 'active' : ''">
        <div class="insure-info-details-benifits">
          <div class="insure-info-details-benifits-item">
            <div class="insure-info-details-benifits-item-icon"><i class="s-icon s-icon-cancel"></i></div>
            <div class="insure-info-details-benifits-item-text">
              <p v-if="flightInfo.isIntl">Claim upto &#8377; 750</p>
              <p v-else>Claim upto &#8377; 20,000</p>
              <p>Trip Cancellation</p>
            </div>
          </div>
          <div class="insure-info-details-benifits-item">
            <div class="insure-info-details-benifits-item-icon"><i class="s-icon s-icon-delay"></i></div>
            <div class="insure-info-details-benifits-item-text">
              <p v-if="flightInfo.isIntl">Claim upto &#8377; 180</p>
              <p v-else>Claim upto &#8377; 15,000</p>
              <p>Trip Delay</p>
            </div>
          </div>
          <p class="insure-info-details-benifits-knowmore">and 8 more benifits <span class="a_link" @click="isShowDetail">know more</span></p>
        </div>
        <div class="insure-info-select" @click="isChecked = !isChecked">
          <i class="s-icon contacts-info-gst-check" :class="isChecked ? 's-icon-select' : 's-icon-unselect'"></i> Secure trip
        </div>
      </div>
      <div class="insure-duration" v-show="flightInfo.isIntl && isChecked">
        <div class="insure-duration-title">
          Insurance Duration
        </div>
        <div class="insure-duration-days">
          <input type="text" v-model="days" @blur="checkInsureDays" placeholder="2~180" class="insure-duration-input">
          days, &#8377; {{insurance.price}} per person.
        </div>
        <p class="insure-info-note">Policy begins on departure date.</p>
      </div>
      <p class="insure-info-note">Insurance only apply to Indian citizen aged between 6 months to 70 years old.  <span @click="showTC(true)" class="a_link">terms &amp; conditions</span></p>
    </div>
    <transition name="insure-slide">
      <insureDetailInt v-if="isInsureDetailInt" />
      <insureDetailDom v-if="isInsureDetailDom" />
    </transition>
    <transition name="insure-opacity">
      <TermsPDF v-if="isShowPDF" :isInt="flightInfo.isIntl" @closePDF="showTC"/>
    </transition>
  </div>
</template>

<script>
import EventHub from '@/utils/EventHub';
import { mapMutations, mapState } from 'vuex';

export default {
  props: ['flightInfo'],
  components: {
    insureDetailDom: () => import('@/components/TermsDomestic.vue'),
    insureDetailInt: () => import('@/components/TermsInternational.vue'),
    TermsPDF: () => import('./TermsPDF'),
  },
  data () {
    return {
      isShowPDF: false,
      isInsureDetailDom: false,
      isInsureDetailInt: false,
      isInsureDetail: false,
      // days:
    };
  },
  computed: {
    /**
     * insurance 结构
     * insurance: {
        checked: false,
        days: 1,
        price: 0,
        orignPirce
      }
      * 对象提交 {days: 2}
    */
    ...mapState(['insurance']),
    isChecked: {
      get () {
        return this.insurance.checked;
      },
      set (val) {
        this.setInsurance({ checked: val });
      }
    },
    days: {
      get () {
        return this.insurance.days;
      },
      set (val) {
        val = parseInt(val.replace(/[^0-9]/g, ''));
        if (Number.isNaN(val)) {
          val = '';
        } else {
          val = Math.min(180, Math.max(val, 0));
        }

        this.setInsurance({ days: val });
      }
    }
  },
  methods: {
    ...mapMutations(['setInsurance']),
    checkInsureDays () {
      const insuranceDays = this.insurance.days;
      if (insuranceDays < 2) {
        this.setInsurance({ days: 2 });
      }
    },
    showTC (res) {
      this.isShowPDF = res;
      EventHub.$emit('controlPDF', true);
    },
    isShowDetail () {
      if (this.flightInfo.isIntl) {
        this.isInsureDetailDom = false;
        this.isInsureDetailInt = true;
      } else {
        this.isInsureDetailDom = true;
        this.isInsureDetailInt = false;
      }
    },

  },
  created () {
    EventHub.$on('isShowInsureDetail', (res) => {
      this.isInsureDetailDom = res;
      this.isInsureDetailInt = res;
    });
    EventHub.$on('isShowPDF', (val) => {
      this.isShowPDF = val;
    });
  }
};
</script>

<style lang="scss" scoped>
  .line-through{
    text-decoration: line-through;
  }
  .insure-info-title{
    font-size: $h3;
    line-height: 30px;
    color: $lightBlack;
    font-weight: 700;
  }
  .insure-info-tips{
    font-size:$h5;
    font-weight:bold;
    color:$green;
    line-height:0.32rem;
    margin: 0.2rem 0 0.3rem;
  }
  .insure-info-select{
    width: 2rem;
    height: 100%;
    display: flex;
    align-items: center;
    position: relative;
  }
  .insure-duration{
    margin-bottom: 0.24rem;
  }
  .insure-duration-title{
    margin-bottom: 0.2rem;
  }
  .insure-duration-days{
    display: flex;
    align-items: flex-end;
    font-size: $h6;
    margin-bottom: 0.3rem;
  }
  .insure-duration-input{
    width:2.8rem;
    height:0.6rem;
    // background:rgba(250,250,250,1);
    margin-right: 0.2rem;
    border-radius:0.12rem;
    text-align: center;
    border:0.01rem solid rgba(220,220,220,1);
  }
  .insure-info-details{
    width: 100%;
    height:2.7rem;
    background:rgba(234,234,234,1);
    box-shadow:0rem 0.02rem 0.06rem 0rem rgba(174,174,174,1);
    border-radius:0.08rem;
    display: flex;
    padding: 0.2rem;
    align-items:center;
    margin-bottom: 0.2rem;
    position: relative;
    &::before{
      content: '';
      position: absolute;
      right: 0;
      bottom: 0;
      width: 1.72rem;
      height: 2.22rem;
      background: url('../images/insurebg.png') no-repeat;
      background-size: 100%;
    }
    &.active{
      background:rgba(1,121,89,0.1);
      &::before{
        background: url('../images/insurebg_a.png') no-repeat;
        background-size: 100%;
      }
    }
  }
  .insure-info-details-benifits{
    width: 4rem;
  }
  .insure-info-details-benifits-item{
    display: flex;
    margin-bottom: 0.3rem;
  }
  .insure-info-details-benifits-item-icon{
    margin: 0.17rem 0.2rem 0 0;
  }
  .insure-info-details-benifits-item-text{
    width:2.39rem;
    height:0.68rem;
    font-size:$h6;
    font-weight:400;
    color:rgba(153,153,153,1);
    line-height:0.34rem;
  }
  .insure-info-details-benifits-knowmore{
    font-size:$h6;
    font-weight:400;
    color:rgba(17,17,17,1);
    line-height:0.34rem;
  }
  .insure-info-note{
    font-size:$h6;
    font-weight:400;
    color:rgba(102,102,102,1);
    line-height: 0.3rem;
  }
  .insure-slide-enter-active {
    animation: bounce-in .5s ease-out;
  }
  .insure-slide-leave-active {
    animation: bounce-in .5s ease-out reverse;
  }
  @keyframes bounce-in {
    0% {
      transform: translateX(500px);
    }
    100% {
      transform: translateX(0px);
    }
  }
  .insure-opacity-enter-active {
    animation: opacity-in .5s ease-in-out;
  }
  .insure-opacity-leave-active {
    animation: opacity-in .5s ease-in-out reverse;
  }
  @keyframes opacity-in {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
</style>
