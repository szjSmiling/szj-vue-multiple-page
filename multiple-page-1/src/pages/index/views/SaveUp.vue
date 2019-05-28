<template>
  <div class="save-ups">
    <div class="save-ups-titles">
      <span class="save-ups-title">Check out our latest offer</span>
      <a href="/offer" class="f12 lightBlack">view all &#8594;</a>
    </div>
    <template v-for="(item, index) in list" >
      <div class="save-up" v-if="index < 5" :class="`bg-${index}`" :key="index" @click="goToCoupon(item)">
        <div class="save-up-title">
          {{item.couponCode?item.discount:item.title}}
        </div>
        <div class="save-up-text">
          {{item.couponCode?item.description:item.alt}}
        </div>
      </div>
    </template>
  </div>
</template>
<script>
import { hasItem, getItem } from '@/utils/CookieUtils';
import { couponProm, getAdvertising } from '@/constants/ApiConstants';
export default {
  data () {
    return {
      list: []
    }
  },
  methods: {
    goToCoupon (item) {
      if (item.couponCode) {
        window.location.href = location.origin + '/coupon?code=' + item.couponCode;
      } else {
        window.location.href = item.href;
      }
    },
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
      this.list = data;
      this.list.sort((a, b) => {
        return a.timeNew > b.timeNew ? -1 : 1;
      }).slice(0, 5);
    }
  },
  created () {
    Promise.all([ // if success ,returns an array in request order.
      this.queryOfferList(),
      this.queryCouponList()
    ]).then(res => {
      this.sortNewList([...res[0], ...res[1]]);
    }).catch(err => { // if fail , returns the first fail reject.
      console.log(err)
    })
  }
}
</script>

<style lang="scss" scoped>
.save-ups{
  padding: 0.3rem 0.3rem 0.1rem;
}
.save-ups-titles{
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.2rem;
}
.save-ups-title{
  // padding: 0 0.3rem;
  font-size: $h3;
  font-weight: bold;
  color: $lightBlack;
}
.save-up{
  width: 100%;
  height: 1.6rem;
  margin-bottom: 0.2rem;
  padding: 0.4rem;
  border-radius:0.24rem;
  &.bg-0{
    background:linear-gradient(270deg,rgba(160,108,220,1) 0%,rgba(103,58,183,1) 100%);
  }
  &.bg-1{
    background:linear-gradient(270deg,rgba(131,216,136,1) 0%,rgba(76,175,80,1) 100%);
  }
  &.bg-2{
    background:linear-gradient(270deg,rgba(255,201,0,1) 0%,rgba(255,152,0,1) 100%);
  }
  &.bg-3{
    background:linear-gradient(270deg,rgba(133,191,217,1) 0%,rgba(3,169,244,1) 100%);
  }
  &.bg-4{
    background:linear-gradient(270deg,rgba(139,152,224,1) 0%,rgba(63,81,181,1) 100%);
  }
  &:active{
    filter: saturate(50%);
  }
}
.save-up-title{
  font-size: $h3;
  color: #fff;
  font-weight: bold;
  margin-bottom: 0.1rem;
}
.save-up-text{
  font-size: $h6;
  color: #fff;

}
</style>
