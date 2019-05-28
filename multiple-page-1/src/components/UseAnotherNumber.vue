<template>
  <div class="use-another-number">
    <p>Checking orders for {{phoneOrEmail}}</p>
    <button @click="switchAccount">Use Another Number</button>
  </div>
</template>
<script>
export default {
  props: ['phoneOrEmail'],
  methods: {
    switchAccount () {
      localStorage.removeItem('token');
      localStorage.removeItem('account');
      location.replace(location.origin + '/trip');
    }
  }
}
</script>
<style lang="scss" scoped>
.use-another-number{
  width:100%;
  padding-bottom: 0.94rem;
  padding-top: 0.3rem;
  p{
    font-size: 0.28rem;
    color:#999;
    margin-bottom: 0.2rem;
    text-align: center;
  }
  button{
    display:block;
    width:4rem;
    font-size: 0.28rem;
    color:#017959;
    font-weight: bold;
    text-decoration: underline;
    margin:auto;
    background: #f1f1f1;
    cursor: pointer;
  }
}
</style>
