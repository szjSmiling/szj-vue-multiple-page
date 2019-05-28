<template>
  <div class="title-item">
    <span class="title-name" :class="{'bar-active': tabBarObj.active}" >{{tabBarObj.title}}</span>
  </div>
</template>
<script>
export default {
  props: {
    tabBarObj: {
      type: Object
    }
  }
};
</script>
<style lang="scss" scoped>
.title-item{
  flex:1;
}
.title-name{
  display: inline-block;
  color:#666;
  font-size:0.24rem;
  line-height:0.3rem;
  padding:0.3rem 0 0.2rem;
  border-bottom:2px solid transparent;
}
.bar-active{
  color:$green;
  border-color:$green;
}
</style>
