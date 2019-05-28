<template>
  <div class="detail_contact" v-if="tripContact">
    <p class="confirm-info-detail-title text-style">Contact Info</p>
    <ul>
      <li class="confirm-info-detail-item">
        <div class="text-style s-confirm-general-key">Name:</div>
        <div class="text-style s-confirm-general-val">{{tripContact.contactName}}</div>
      </li>
      <li class="confirm-info-detail-item">
        <div class="text-style s-confirm-general-key">Phone:</div>
        <div class="text-style s-confirm-general-val">{{tripContact.contactMob}}</div>
      </li>
      <li class="confirm-info-detail-item">
        <div class="text-style s-confirm-general-key">E-mail:</div>
        <div class="text-style s-confirm-general-val">{{tripContact.contactEmail}}</div>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  props: ['tripContact']
}
</script>
<style lang="scss" scoped>
.text-style{
  font-size: 0.24rem;
  line-height: 0.3rem;
}
.detail_contact{
  padding-top: 0.4rem;
  margin-bottom: 0.4rem;
}
.confirm-info-detail-title{
  font-size:0.32rem;
  color:$lightBlack;
  line-height:0.39rem;
  font-weight: bold;
  margin-bottom: 0.3rem;
}
.confirm-info-detail-item{
  display: flex;
  margin-bottom: 0.1rem;
}
.confirm-info-detail-item-price{
  margin-top: 0.38rem;
}
.s-confirm-general-key{
  width: 30%;
  color:rgba(153,153,153,1);
}
.s-confirm-general-val{
  width: 70%;
  color:rgba(17,17,17,1);
}
</style>
