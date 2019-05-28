<template>
  <div class="recent-trips">
    <div class="recent-trips-title">
        Your recent trips
      <a href="/trip" class="lightBlack">
        see all
      </a>
    </div>
    <div class="recent-trip">
      <TripInfoPart/>
      <div class="recent-trip-states">
        <div class="recent-trip-state">
          {{'completed'}}
        </div>
        <a href="/trip" class="recent-trip-detail">
            Trip Detail
        </a>
      </div>
    </div>
  </div>
</template>
<script>
import TripInfoPart from '@/components/TripInfoPart';

export default {
  components: {
    TripInfoPart
  }
}
</script>

<style lang="scss" scoped>
.recent-trips-title{
  display: flex;
  justify-content: space-between;
  padding: 0.2rem 0.3rem;
  font-size: 0.28rem;
  font-weight: bold;
  color: $lightBlack;

}
.recent-trip{
  display: flex;
  justify-content: space-between;
  width: 6.6rem;
  height: 1.61rem;
  padding: 0.2rem;
  margin: 0 auto 0.2rem;
  background-color: #fff;
  border-radius: 0.12rem;
}
.recent-trip-states{
  display: flex;
  height:100%;
  align-items: center;
  flex-direction: column;
  justify-content: space-between;

}
.recent-trip-state{
  text-align: center;
  font-size: 0.22rem;
  width: 1.63rem;
  height: 0.42rem;
  line-height: 0.42rem;
  background-color: rgba(1,121,89,0.1);
  border-radius:0.12rem;
}
.recent-trip-detail{
  color:#E3A428;
  font-size: 0.22rem;
}
</style>
