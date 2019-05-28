<template>
  <div class="home-wrap">

    <transition name="slide">
      <router-view></router-view>
      <!-- <SearchCity v-if="showCityLayer"/> -->
    </transition>
    <!-- <transition name="slide">
      <Calendar v-if="showCalendarLayer"/>
    </transition>
    <transition name="slide">
      <SearchPassenger v-if="showPassengerLayer"/>
    </transition> -->
    <div class="mask" v-show="isMask"></div>
    <HomeTopBanner/>
    <SearchForm />
    <SearchHistory/>
    <SaveUp/>
    <HomeInfo/>
    <div class="home-support">
      <p>Support</p>
      <div class="support_contact">
        <a class="s-c-mail_to" href="mailto:cc@happeasygo.com">cc@happeasygo.com</a>
        <div class="s-c-phone">
          <a href="tel:0124-607-9960">0124-607-9960</a> /
          <a href="tel:1860-313-999">1860-313-999</a>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import SearchForm from './SearchForm';
import HomeTopBanner from './HomeTopBanner';
import SearchHistory from './SearchHistory';
import SaveUp from './SaveUp';
import HomeInfo from './HomeInfo';

export default {
  name: 'Home',
  components: {
    SearchForm,
    HomeTopBanner,
    SearchHistory,
    // RecentTrips,
    SaveUp,
    HomeInfo,
    // HomeOffer,
  },
  data () {
    return {
      // isMask: false,
    };
  },
  computed: {
    isMask () {
      return this.$route.meta.isMask;
    }
  },
  created () {
    // 存储最新searchForm
    if (sessionStorage.getItem('home_store')) {
      this.$store.replaceState(Object.assign({}, this.$store.state, JSON.parse(sessionStorage.getItem('home_store'))))
    }
    window.addEventListener('beforeunload', () => {
      sessionStorage.setItem('home_store', JSON.stringify(this.$store.state))
    })
  }
};
</script>
<style lang="scss" scoped>
  .home-wrap{
    width: 100%;
    overflow: hidden;
    background-color: #f1f1f1;
    .home-support{
      padding:0.3rem;
      background:rgba(1,121,89,1);
      p{
        font-size:0.24rem;
        font-weight:bold;
        color:rgba(255,255,255,1);
        line-height:0.3rem;
        margin-bottom: 0.1rem;
      }
      .support_contact{
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size:0.22rem;
        font-weight:400;
        *{
          color:rgba(255,255,255,1);
        }
      }
      a{
        line-height:0.27rem;
      }
      .s-c-phone, .s-c-mail_to{
        text-decoration: underline;
      }
    }
  }
</style>
