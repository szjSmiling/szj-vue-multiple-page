<template>
  <div>
    <mt-progress :value="uploadParams.upProcess" :bar-height="2">
      <div slot="start">{{uploadParams.startText}}</div>
      <div slot="end">{{uploadParams.endText}}</div>
    </mt-progress>
  </div>
</template>
<script>
import { Progress } from 'mint-ui';
export default {
  components: {
    'mt-progress': Progress
  },
  props: {
    uploadParams: {
      type: Object
    }
  }
}
</script>
<style lang="scss">
.mt-progress-progress{
  // width: 100% !important;
  background: $green;
}
</style>
