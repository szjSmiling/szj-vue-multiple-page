<template>
  <div class="trip_detail" :class="{'unpaid_trip': showUnpaid}">
    <TripUncomping v-if="showUncomping" />
    <TripUnpaid v-if="showUnpaid" />
    <TripCompleted v-if="showCompleted" />
    <TripCancelled v-if="showCancelled" />
  </div>
</template>
<script>
import TripUncomping from './StatusUncomping.vue';
import TripUnpaid from './StatusUnpaid.vue';
import TripCompleted from './StatusCompleted.vue';
import TripCancelled from './StatusCancelled.vue';
import { ScrollToPageTop } from '@/utils/ScrollToPageTop';
export default {
  components: {
    TripUncomping,
    TripUnpaid,
    TripCompleted,
    TripCancelled
  },
  data () {
    return {
      showUncomping: false,
      showUnpaid: false,
      showCompleted: false,
      showCancelled: false
    }
  },
  created () {
    let tripId = this.$route.query.tripId;
    this.$store.commit('saveSearchDetailInfo', tripId);
    let status = this.$route.query.status;
    if (status === '1') {
      this.showUncomping = true;
    } else if (status === '2') {
      this.showUnpaid = true;
    } else if (status === '3') {
      this.showCompleted = true;
    } else if (status === '4') {
      this.showCancelled = true;
    }
  },
  mounted () {
    ScrollToPageTop('trip_detail');
  }
}
</script>
<style lang="scss" scoped>
.trip_detail{
  // height:calc(100% - 1.2rem);
  height: 100%;
  overflow:auto;
  padding-bottom: 0.98rem;
}
.unpaid_trip{
  padding-bottom: 0;
}
</style>
