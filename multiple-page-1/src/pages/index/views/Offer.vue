<template>
  <div class="home-offer-wrap">
    <div class="home-offer-title">
       Check out our latest offer
    </div>
    <div class="home-offers-wrap">
      <div class="home-offers">
        <div class="home-offer" v-for="(offer, index) in offers" :key="index">
          <img :src="offer.url" alt="" class="home-offer-ban">
          <div class="home-offer-sum">
            <div class="home-offer-main">{{offer.title}}</div>
            <div class="home-offer-text">{{offer.alt}}</div>
            <div class="home-offer-valid">Valid till: {{getWDMY(new Date(offer.endDate))}}</div>
          </div>
        </div>
        <div class="home-offer">
          <img v-if="offers[0]" :src="offers[0].url" alt="" style="height: 100%">
        </div>
      </div>
    </div>

  </div>
</template>
<script>
import { getWDMY } from '@/utils/DateFormatUtils';
import { hasItem, getItem } from '@/utils/CookieUtils';
export default {
  data () {
    return {
      offers: [],
      getWDMY
    }
  },
  computed: {
    activeOffers () {
      return this.offers.filte(v => v.use);
    }
  },
  methods: {
    getOffers () {
      let url = `/heg_api/advertising/advList.do?type=13&device=0&platform=${hasItem('platform') ? getItem('platform') : '065626cf-a5a9-4ae8-ba71-ed5f4b8b748d'}`;
      this.$http(url, {
        'x-Device': 'mobile'
      }).then(res => {
        if (res.list instanceof Array && res.list.length > 0) {
          this.offers = res.list;
        }
      })
    }
  },
  created () {
    this.getOffers();
  }
}
</script>
<style lang="scss" scoped>
.home-offer-wrap{
  padding-top: 0.2rem;
}
.home-offer-title{
  padding: 0 0.3rem;
  font-size: 0.28rem;
  font-weight: bold;
  color: $lightBlack;
  margin-bottom: 0.2rem;
}
.home-offers-wrap{
   width: 100%;
    overflow-x: scroll;
    &::-webkit-scrollbar{
      display: none;
    }
}
.home-offers{
  display: flex;
  flex-wrap: nowrap;
  width: fit-content;
  padding-left: 0.3rem;
}
.home-offer{
  width:4.2rem;
  height: 3.8rem;
  overflow: hidden;
  background-color: #fff;
  border-radius: 0.12rem;
  & + {
    .home-offer{
      margin-left: 0.2rem;
    }
  }
}
.home-offer-ban{
  width: 4.2rem;
  height: 2.2rem;

}
.home-offer-sum{
  padding: 0.1rem 0.2rem;
}
.home-offer-main{
  font-size: 0.28rem;
  color: $green;
  font-weight: bold;
  margin-bottom: 0.1rem;
}
.home-offer-text{
  font-size: 0.22rem;
  margin-bottom: 0.1rem;
  color: $lightBlack;
}
.home-offer-valid{
  font-size: 0.18rem;
  color: $lightBlack;
}
</style>
