<template>
  <div class="slider" role="button" tabIndex="0" @click=onClick>
    <div class="slider_bar" ref="slider_bar">
      <div class="slider_bar_fill" :style="{width, left}">
        <div class="slider_hander low" v-if="!isSingle" @click="prevent" @mousedown="onDragStart(0, $event)" @touchstart="onDragStart(0, $event)"></div>
        <div class="slider_hander high" @click="prevent"  @mousedown="onDragStart(1, $event)" @touchstart="onDragStart(1, $event)"></div>
      </div>
    </div>
  </div>
</template>
<script>
import { offsetLeft } from '@/utils/DomUtils';
// import * as _ from 'lodash';
export default {
  props: {
    value: [Number, Array],
    range: Array,
  },
  data () {
    return {
      slider_hander_index: 0
    }
  },
  computed: {
    isSingle () {
      return typeof this.value === 'number';
    },
    rangelength () {
      return this.range[1] - this.range[0];
    },
    width () {
      const valueLength = this.value[1] - this.value[0];
      return `${valueLength / this.rangelength * 100}%`;
    },
    left () {
      const rangelength = this.range[1] - this.range[0];
      const lowLength = this.value[0] - this.range[0];
      return `${lowLength / rangelength * 100}%`;
    }
  },
  methods: {
    prevent (e) {
      e.preventDefault();
      e.stopPropagation();
    },
    onDragStart (index, e) {
      if (e.type === 'mousedown' && e.which !== 1) return;
      e.stopPropagation();
      e.preventDefault();
      this.slider_hander_index = index;
      document.addEventListener('touchmove', this.onDrag);
      document.addEventListener('mousemove', this.onDrag);
      document.addEventListener('mouseup', this.onDrayEnd);
      document.addEventListener('touchend', this.onDrayEnd);
    },
    onDrag (e) {
      e.stopPropagation();

      if (e.touches && e.touches.length) {
        e = e.touches[0];
      } else if (e.changedTouches && e.changedtouches.length) {
        e = e.changedTouches[0];
      }
      const diff = e.clientX - offsetLeft(this.$refs.slider_bar);
      if (this.slider_hander_index === 0) {
        const highPercent = (this.value[1] - this.range[0]) / this.rangelength;
        const percent = Math.min(Math.max(diff / this.$refs.slider_bar.offsetWidth, 0), highPercent);
        const lowValue = parseInt(percent * this.rangelength) + this.range[0];
        this.$emit('changeValue', [lowValue, this.value[1]])
      } else {
        const lowPercent = (this.value[0] - this.range[0]) / this.rangelength;
        const percent = Math.min(Math.max(diff / this.$refs.slider_bar.offsetWidth, lowPercent), 1);
        const highValue = parseInt(percent * this.rangelength) + this.range[0];
        this.$emit('changeValue', [this.value[0], highValue])
      }
    },
    onDrayEnd () {
      document.removeEventListener('mousemove', this.onDrag);
      document.removeEventListener('mouseup', this.onDrayEnd);
      document.removeEventListener('touchend', this.onDrayEnd);
      document.removeEventListener('touchmove', this.onDrag);
    },
    onClick (e) {
      // const percent = (e.clientX - offsetLeft(e.currentTarget)) / e.currentTarget.offsetWidth;
      // return (percent * this.max);
    }
  },
  beforeDestroy () {
    document.removeEventListener('mousemove', this.onDrag);
    document.removeEventListener('mouseup', this.onDrayEnd);
  }
}
</script>

<style lang="scss" scoped>
.slider{
  display: flex;
  padding: 8px 0;
  align-items: center;
  width: 100%;
  outline: 0;
  &:hover{
    cursor:pointer;
  }
}
.slider_bar{
  background-color: #ddd;
  height: 3px;
  width: 100%;
}
.slider_bar_fill{
  position: relative;
  height: 3px;
  background-color: $green;
}
.slider_hander{
  position: absolute;
  right: -10px;
  top: -9px;
  width: 20px;
  height: 20px;
  background-color: #fff;
  border: 1px solid $green;
  outline: 0;
  border-radius: 50%;
  z-index: 1;
  &.low{
    left: -10px;
  }
  & + .slider_hander{
    z-index: 2;
  }
}
</style>
