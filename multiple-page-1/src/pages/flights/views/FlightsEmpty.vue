<template>
  <div class="flights-empty">
    <i class="F_E-icon"></i>
    <div class="F_E-text">Sorry, we can’t find any flight <br> availble for your search.</div>
    <div role="button" class="F_E-btn" @click="$emit('showSearchForm', true)">
      Modify Search
    </div>
  </div>
</template>
<style scoped lang="scss">
  .flights-empty{
    display:flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 1.67rem;
  }
  .F_E-icon{
    margin-bottom: 0.2rem;
    width: 1.2rem;
    height: 1.2rem;
    background: url('../images/icon-sad.png') no-repeat center/contain;
  }
  .F_E-text{
    margin-bottom: 0.7rem;
    text-align: center;
  }
  .F_E-btn{
    width:4.8rem;
    height:0.68rem;
    font-size:0.28rem;
    background: $yellow;
    border-radius:0.12rem;
    text-align: center;
    color: #fff;
    line-height:0.68rem;
  }
</style>
