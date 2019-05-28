<template>
  <div class="modal">
    <div class="modal-content">
      <p class="cont">{{errorMsg}}</p>
      <button @click="hideModel" class="btn">Confirm</button>
    </div>
  </div>
</template>

<script>
import EventHub from '@/utils/EventHub';
export default {
  props: ['errorMsg', 'modalType'],
  data () {
    return {
      isShow: true,
    }
  },
  methods: {
    hideModel () {
      if (this.modalType === 1) {
        EventHub.$emit('isShowModel', false);
      } else {
        return this.$router.go(-1)
      }
    }
  },
}
</script>

<style>
  .modal{
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 1050;
    background:rgba(0,0,0,0.8);

  }
  .modal-content{
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    width:6.4rem;
    background:rgba(255,255,255,1);
    border-radius:0.12rem;
    text-align: center;
    font-size: 0.28rem;
    padding: 0.6rem;
  }
  .modal .cont{
    color:rgba(17,17,17,1);
    line-height:0.42rem;
    margin-bottom: 0.6rem;
  }
  .modal .btn{
    display: inline-block;
    width:4.8rem;
    height:0.68rem;
    background:rgba(227,164,40,1);
    border-radius:0.12rem;
    color: white;
    line-height: 0.68rem;
    text-align: center;
  }
</style>
