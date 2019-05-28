<template>
  <div class="offer_box">
    <!-- <OfferTop /> -->
    <div class="offer_list" ref="offer_list" >
      <template v-for="(item, index) in advList" >
        <OfferList :key="index" :offerInfo="item" />
      </template>
    </div>
    <Foot />
  </div>
</template>
<script>
import { Indicator, Toast } from 'mint-ui';
import { hasItem, getItem } from '@/utils/CookieUtils';
import { getAdvertising, couponProm } from '@/constants/ApiConstants';
export default {
  name: 'Offer',
  components: {
    // OfferTop: () => import('./OfferTop'),
    OfferList: () => import('./OfferList'),
    Foot: () => import('@/components/Foot.vue')
  },
  data () {
    return {
      advList: []
    };
  },
  methods: {
    queryOfferList () {
      let url = `${getAdvertising}?type=13&device=0&platform=065626cf-a5a9-4ae8-ba71-ed5f4b8b748d`;
      return new Promise((resolve, reject) => {
        this.$http(url, {
          headers: {
            'x-Device': 'mobile'
          }
        }).then(res => {
          if (res.success) {
            resolve(res.list instanceof Array ? res.list : []);
          }
        })
      })
    },
    queryCouponList () {
      return new Promise((resolve, reject) => {
        this.$http.post(couponProm, {
          'device': 2,
          'page': 1,
          'pageSize': 100,
          'platform': hasItem('platform') ? getItem('platform') : '065626cf-a5a9-4ae8-ba71-ed5f4b8b748d'
        }).then(res => {
          if (res.success) {
            resolve(res.data instanceof Array ? res.data : []);
          }
        })
      })
    },
    sortNewList (data) {
      for (var i = 0; i < data.length; i++) {
        data[i].timeNew = (new Date(data[i].startDate.replace(/-/g, '/'))).getTime();
      }
      this.advList = data;
      this.advList.sort((a, b) => {
        return a.timeNew > b.timeNew ? -1 : 1;
      })
    }
  },
  created () {
    Indicator.open({
      spinnerType: 'fading-circle'
    });
    Promise.all([ // if success ,returns an array in request order.
      this.queryOfferList(),
      this.queryCouponList()
    ]).then(res => {
      Indicator.close();
      this.sortNewList([...res[0], ...res[1]]);
    }).catch(err => { // if fail , returns the first fail reject.
      Toast(err.message ? err.message : 'Serve error!')
    })
  }
};
</script>
<style lang="scss" scoped>
.offer_box{
  height:100%;
}
.offer_list{
  padding:0.3rem 0.3rem 1.28rem;
  height:100%;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
}
.home-logo{
  position: fixed;
  bottom: 0;
  left: 0;
}
</style>
