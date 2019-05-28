<template>
  <div class="loading">
    <div class="loading-item"></div>
    <div class="loading-item"></div>
    <div class="loading-item"></div>
  </div>
</template>
<style lang="scss" scoped>
  .loading{
    width: 100%;
    height: 100%;
    display:flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }
  .loading-item{
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: #fff;
    animation: loading_dot 0.6s infinite;

    & + .loading-item{
      margin-left: 5px;
    }

    &:nth-of-type(2){
      animation-delay: 0.2s;
    }
    &:nth-of-type(3){
      animation-delay: 0.4s;
    }
  }
  @keyframes loading_dot {
    75%{
      opacity: 0.3;
    }
  }

</style>
