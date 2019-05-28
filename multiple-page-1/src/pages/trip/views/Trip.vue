<template>
  <div class="user_trip">
    <TripHeader></TripHeader>
    <TripList></TripList>
  </div>
</template>
<script>
import TripHeader from './TripHeader.vue';
import TripList from './TripList.vue';
export default {
  components: {
    TripHeader,
    TripList
  }
};
</script>
<style lang="scss" scoped>
.user_trip{
  position: relative;
  // height:calc(100% - 1.2rem);
  height: 100%;
  overflow:auto;
}
.user_trip_header{
  width:100%;
  height:0.84rem;
  position: fixed;
  left: 0;
  // top: 1.2rem;
  top: 0;
  z-index:5;
}
</style>
