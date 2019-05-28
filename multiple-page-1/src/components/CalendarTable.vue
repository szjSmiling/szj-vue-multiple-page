<template>
  <div class="calendar-table">
    <div class="calendar-header">
      <div class="calendar-header-title">{{dateType === 0 ? 'Select departure date' : 'Select arrival date'}}</div>
      <div class="calendar-weeks">
        <span class="calendar-week" v-for="(w, idx) in week" :key="idx">{{w}}</span>
      </div>
    </div>
    <div class="calendar-days">
      <div class="dayRow" v-for="month in monthArr" :key="month" >
        <div class="month-header">{{ getMonthAndYear(new Date(currentDate.getFullYear(), currentDate.getMonth() + month)) }}</div>

        <div class="dayCard">
          <div class="day" v-for="i in firstDayInWeek(currentDate.getFullYear(), currentDate.getMonth() + month)" :key="-i"></div>

          <div class="day" v-for="day in getDaysBymonth(currentDate.getFullYear(), currentDate.getMonth() + month + 1)" :key="day"
          @click="changeSelectDay(month, day)"
          :class="{
            select: isSelect(month, day),
            disable: disable(month, day)
          }">
            <div class="day-text">{{day}}</div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import * as formateDate from '@/utils/DateFormatUtils';

export default {
  props: ['dateType', 'selectedDate', 'minDate', 'maxDate'],
  data () {
    return {
      // maxDate: new Date(this.currentDate.getFullYear() + 1, this.currentDate.getMonth(), this.currentDate.getDate()),
      week: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
      monthsFull: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'Auguest', 'September', 'October', 'November', 'December'],
      currentDate: new Date(),
      monthArr: Array.from(Array(13), (v, k) => k)
    };
  },
  // 以当前年为基础，
  methods: {
    isSelect (month, day) {
      const d2 = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + month, day);
      const flag = (typeof this.selectedDate === 'string' ? this.selectedDate : formateDate.getYearMonthDayString(this.selectedDate)) === formateDate.getYearMonthDayString(d2);
      return flag;
    },
    disable (month, day) {
      // table 里的24:00 时间
      const tableDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + month, day + 1);
      // 小于最小 日期的 ，大于最大日期的 都disable
      return this.minDate.getTime() > tableDate.getTime() - 1 || this.maxDate.getTime() < tableDate.getTime() - 1;
    },
    getMonthAndYear (date) {
      return this.monthsFull[date.getMonth()] + ' ' + date.getFullYear();
    },
    changeSelectDay (month, day) {
      // 点 disable的 不触发
      if (this.disable(month, day)) return;

      const nextDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + month, day);
      // dispatch
      this.$emit('changeSelect', nextDate);
    },
    getMonthArr () {
      // 获取月数差 默认12；
    },
    firstDayInWeek (y, m) {
      return new Date(y, m, 1).getDay();
    },
    getDaysBymonth (y, m) {
      return new Date(y, m, 0).getDate();
    }
  }
};
</script>

<style lang="scss" scoped>
  @mixin padding {
    padding: 0 0.3rem;
  }
  .calendar-table{
    position: relative;
    width: 100%;
    height: 100%;
    overflow-y: scroll;
    overscroll-behavior: contain;
  }
  .calendar-header{
    position: sticky;
    top: 0;
    left: 0;
    background-color: #fff;
  }
  .calendar-header-title{
    font-size: 0.28rem;
    font-weight: bold;
    padding: 0.3rem;

  }
  .calendar-weeks{
    display: flex;
    align-items: center;
    justify-content: space-around;
    @include padding;
    margin-bottom: 0.3rem;
  }
  .calendar-week{
    width: 14.28571%;
    font-size: 0.28rem;
    font-weight: bold;
    text-align: center;
    padding-bottom: 0.1rem;
    border-bottom: 1px solid $lightGray;
  }
  .calendar-days{
    width: 100%;
    height: fit-content;
    padding-bottom: 140px;
  }
  .month-header{
    font-size: 0.28rem;
    font-weight: bold;
    padding-left: 0.3rem;
  }
  .dayCard{
      display: flex;
      flex-wrap: wrap;
      @include padding;
      .day{
        display: flex;
        align-items: center;
        justify-content: center;
        width: 14.28571%;
        height: 0.78rem;
        border-radius: 0.12rem;
        &.select{
          background-color: $green;
          color: #fff;
        }
        &.disable{
          color: $lightGray;
        }
      }
      .day-text{
        font-size: 0.34rem;
        // width: 100%;
        // height: 100%;
      }
    }
</style>
