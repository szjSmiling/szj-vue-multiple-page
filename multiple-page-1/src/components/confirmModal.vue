<template>
  <div class="modal">
    <div class="modal-content">
      <p class="cont">{{errorMsg}}</p>
      <button @click="hideModel" class="btn">{{btnText|| 'Confirm'}}</button>
      <button @click="hideModel('cancel')" class="btn-cancel" :style="btnBgStyle?'background:#fff;':''">Cancel</button>
    </div>
  </div>
</template>

<script>
import EventHub from '@/utils/EventHub';
export default {
  // props: ['errorMsg', 'modelType'],
  props: {
    errorMsg: String,
    btnText: String,
    btnBgStyle: Boolean,
    isShowCancel: Boolean,
  },
  data () {
    return {
    }
  },
  methods: {
    hideModel (type) {
      if (type === 'cancel') {
        EventHub.$emit('isShowModel', false);
      } else {
        EventHub.$emit('isShowModel', true);
      }
    }
  },
}
</script>

<style lang="scss">
  .modal{
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 1050;
    background:rgba(0,0,0,0.7);

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
    &:active{
      background:#CB9323;
    }
  }
  .modal .btn-cancel{
    display: inline-block;
    width:4.8rem;
    height:0.68rem;
    // border-radius:0.12rem;
    color: $lighterBlack;
    line-height: 0.68rem;
    text-align: center;
  }
</style>
