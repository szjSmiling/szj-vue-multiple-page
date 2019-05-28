<template>
  <div class="user_trip_header">
    <template v-for="(item, index) in tabBarList" >
      <TabBar :tabBarObj="item" :key="index" @click.native="searchDiffOrder(index)"></TabBar>
    </template>
  </div>
</template>
<script>
export default {
  components: {
    TabBar: () => import('@/components/TabBar')
  },
  data () {
    return {
      tabBarList: [
        { id: 1, title: 'Upcoming', active: true },
        { id: 2, title: 'Unpaid', active: false },
        { id: 3, title: 'Completed', active: false },
        { id: 4, title: 'Cancelled', active: false }
      ]
    };
  },
  methods: {
    searchDiffOrder (index) {
      this.tabBarList.forEach((e, i) => {
        if (index === i) {
          e.active = true;
          this.$store.dispatch('selectDiffStatus', e.id);
        } else {
          e.active = false;
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.user_trip_header{
  @include flexCenter;
  text-align: center;
  background: #fff;
  // border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
}
</style>
