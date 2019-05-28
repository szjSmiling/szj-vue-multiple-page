<template>
  <div class="payment-warp">
    <div class="payment-info">
      <p class="payment-info-title">Secured Payment</p>
      <div class="payment-info-detail">
        <p class="payment-info-detail-amount">Ammount:</p>
        <p class="payment-info-detail-num">&#8377;{{totalAmount | addCommas}}</p>
      </div>
      <div class="payment-info-detail">
        <p class="payment-info-detail-amount">Order ID:</p>
        <p class="payment-info-detail-num">{{orderId}}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['orderId', 'totalAmount'],
}
</script>
<style lang="scss" scoped>
  .payment-warp{
    padding: 0 0.3rem;
  }
  .payment-info{
    border-bottom: 1px solid #DCDCDC;
  }
  .payment-info-title{
    font-size:0.28rem;
    font-weight:bold;
    color:rgba(102,102,102,1);
    line-height:0.35rem;
    margin-bottom: 0.24rem;
  }
  .payment-info-detail{
    display: flex;
    margin-bottom: 0.3rem;
  }
  .payment-info-detail-amount{
    width: 50%;
    font-size:0.24rem;
    color:rgba(153,153,153,1);
    line-height:0.3rem;
  }
  .payment-info-detail-num{
    width: 50%;
    text-align: right;
    font-size:0.28rem;
    font-weight:bold;
    color:rgba(17,17,17,1);
    line-height:0.35rem;
  }
</style>
