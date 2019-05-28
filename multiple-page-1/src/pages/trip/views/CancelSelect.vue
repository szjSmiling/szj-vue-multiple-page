<template >
  <div class="cancel-trip-select-travele" v-if="totalPeople && totalPeople.length > 0">
    <div v-if="travel.status == 1">
      <input type="checkbox" :id="forId+index2" v-model="totalPeople[index2]['checked']" name="checked" class="hide">
      <label :for="forId+index2"  class="select_user lightBlack">
        <i class="s-icon" :class="totalPeople[index2]['checked'] ? 's-icon-select' : 's-icon-unselect'"></i>
        {{`${travel.ptype}.`}}{{travel.name | passenger}}
      </label>
    </div>
    <div v-else class="clear">
      <label class="select_user lightBlack">
        <i class="s-icon s-icon-remove"></i>
        {{`${travel.ptype}.`}}{{travel.name | passenger}}
      </label>
      <span v-if="ticketInfo" class="travel_status">{{Tstatus[ticketInfo.status]}}</span>
    </div>
  </div>
</template>
<script>
export default {
  props: ['travel', 'ticketInfo', 'forId', 'totalPeople', 'index2'],
  filters: {
    passenger (val) {
      let name;
      if (val.indexOf('/') > 0) {
        name = val.split('/');
        return name[1] + ',' + name[0];
      }
    }
  },
  computed: {
    Tstatus () {
      return this.$store.state.MyTripList.Tstatus
    }
  }
}
</script>
<style lang="scss" scoped>
.lighterBlack{
  color: $lighterBlack;
}
.s-icon{
  vertical-align: middle;
  margin-right: 0.2rem;
}
.cancel-trip-select{
  margin-top: 0.3rem;
}
.cancel-trip-select-travele{
  margin-bottom: 0.2rem;
}
.select_user{
  display: inline-block;
  font-size: 0.24rem;
  height: 16px;
  line-height: 16px;
}
.travel_status{
  float: right;
  color:$lighterBlack;
  font-size: 0.2rem;
  line-height: 0.25rem;
}
.cancel-trip-details-title,
.cancel-trip-select-titel{
  margin: 0.3rem 0;
  font-weight: 700;
}
</style>
