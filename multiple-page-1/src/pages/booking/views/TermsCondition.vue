<template>
  <div class="TC">
    <HeaderTop header-title="Terms &amp; Conditions" :goBack="hideTC">
      <!-- <span slot="title_center" class="s-icon s-icon-return hide_tc" @click="hideTC"></span> -->
    </HeaderTop>
    <div class="tc_content" v-show="!showDomestic">
      <div v-for="i in termsList" :key="i.cid">
        <h2 class="tc-info-title" >{{i.class}}</h2>
        <p class="tc-info-detail_1" v-for="(j,index) in i.content" :key="index" v-html="j.content">{{j.content}}</p>
        <p class="tc-info-a" v-if="i.cid == 83"><a href="javascript:" @click='showDomesticTerms' target="_blank">Domestic Flight Booking Terms</a></p>
      </div>
    </div>
    <div class="tc_content tc_domestic" v-show="showDomestic">
      <div v-for="(item,index) in domesticTerms" :key="index">
        <div v-for="(obj1,i1) in item.node" :key="i1">
          <h2 class="tc-info-title" v-html="obj1.class">{{obj1.class}}</h2>
          <div v-for="(obj21,i21) in obj1.content" :key="i21">
            <p class="tc-info-detail_1" v-html="obj21.content">{{obj21.content}}</p>
          </div>
        </div>
        <p v-for="i in item.content" :key="i.cid" v-html="i.content">{{i.content}}</p>
      </div>
    </div>
  </div>
</template>
<script>
import HeaderTop from '@/components/Header.vue';
import EventHub from '@/utils/EventHub';
import { Toast, Indicator } from 'mint-ui';
import { hasItem, getItem } from '@/utils/CookieUtils.js';
export default {
  name: 'Home',
  components: {
    HeaderTop
  },
  data () {
    return {
      showDomestic: false,
      termsList: [],
      domesticTerms: []
    }
  },
  created () {
    this.getTermInfo();
  },
  methods: {
    hideTC () {
      if (this.showDomestic) {
        this.showDomestic = false;
      } else {
        EventHub.$emit('isShowTC', false);
      }
    },
    getTermInfo () {
      Indicator.open({
        spinnerType: 'fading-circle'
      });
      let url = '/heg_api/advertising/getNodeList.do?cId=82&platform=' + (hasItem('platform') ? getItem('platform') : '065626cf-a5a9-4ae8-ba71-ed5f4b8b748d');
      this.$http(url, {
        headers: {
          'x-Device': 'mobile'
        }
      }).then(res => {
        Indicator.close();
        if (res.success) {
          this.termsList = res.list[0].node;
        } else {
          Toast({
            message: res.msg,
            duration: 1500
          });
        }
      });
    },
    showDomesticTerms () {
      this.showDomestic = true;
      this.getDomesticTerms();
    },
    getDomesticTerms () {
      Indicator.open({
        spinnerType: 'fading-circle'
      });
      let url = '/heg_api/advertising/getNodeList.do?cId=1&platform=' + (hasItem('platform') ? getItem('platform') : '065626cf-a5a9-4ae8-ba71-ed5f4b8b748d');
      this.$http(url, {
        headers: {
          'x-Device': 'mobile'
        }
      }).then(res => {
        Indicator.close();
        if (res.success) {
          this.domesticTerms = res.list;
        } else {
          Toast({
            message: res.msg,
            duration: 1500
          });
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
  .hide_tc{
    position: absolute;
  }
  .TC{
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 1050;
    overflow: auto;
    background: white;
  }
  .tc_content{
    padding:0 0.3rem 0.3rem;
  }
  .tc-info-title{
    font-size:0.28rem;
    font-weight:bold;
    color:#333;
    line-height:0.35rem;
    padding-top: 0.2rem;
  }
  .tc-info-detail_1{
    font-size:0.24rem;
    color:#666;
    line-height:0.37rem;
    padding:0.1rem 0;
  }
  .tc-info-a a{
    color: #0db790;
    font-size:0.24rem;
    cursor: pointer;
  }
</style>
