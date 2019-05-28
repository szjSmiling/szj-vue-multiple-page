<template>
  <div class="top_img_box">
    <img class="top_img" :src="require('../images/top.png')" alt="">
  </div>
</template>
<script>
export default {
  props: []
};
</script>
<style lang="scss" scoped>
.top_img_box{
  height:3rem;
}
.top_img{
  width:100%;
  height:3rem;
  vertical-align: top;
}
</style>
