<template>
  <div class="change-trip-warp scrollY"  >
    <div v-if="triplist && triplist.length >= 1">
      <h4 class="chance_title">Change Trip</h4>
      <p>
        <span class="change-trip-title lighterBlack">Order ID :</span>
        <span class="change-trip-title lightBlack"> {{tripId}}</span>
      </p>
      <div class="change-trip-select" v-if="orderInfo.international && triplist.length > 1" >
        <div>
          <h4 class="change-trip-select-titel lightBlack">
            {{tripInfo.voyageinfo[0].ds}} - {{tripInfo.voyageinfo[tripInfo.voyageinfo.length - 1].as}} {{getMonthDayYearString(new Date(tripInfo.voyageinfo[0].dt))}}
          </h4>
          <template v-if="tripInfo.travellerinfo && tripInfo.travellerinfo.length >= 1" >
            <div v-for="(travel, index2) in tripInfo.travellerinfo" :key="index2">
              <SelectTravel :travel="travel" :totalPeople="intChangeData.totalPeople"
              :ticketInfo="tripInfo.ticketsinfo[0][index2]" :forId="'change-checkbox0'" :index="0" :index2="index2" />
            </div>
          </template>
        </div>
        <p class="int_notice">For international flights, trips has to be operated altogether.</p>
        <div class="change-trip-details">
          <h4 class="change-trip-select-titel lightBlack">Change Departure</h4>
          <div class="change_label lightBlack">Date:
            <p class="change-trip-details-date-input int_input" @click="showDateModel = true;goOrfrom = 1;">
              {{intChangeData.departDate}}
            </p>
            <i class="s-icon s-icon-datadown" @click="showDateModel = true;"></i>
          </div>
          <label class="change_label lightBlack" for="changeFN">Flight:
            <input type="text" id="changeFN" class="change-trip-details-fn-input int_input" v-model="intChangeData.departFn" />
          </label>
          <h4 class="change-trip-select-titel lightBlack">Change Arrival</h4>
          <div class="change_label lightBlack">Date:
            <p class="change-trip-details-date-input int_input" @click="showDateModel = true;goOrfrom = 2;">
              {{intChangeData.returnDate}}
            </p>
            <i class="s-icon s-icon-datadown" @click="showDateModel = true;"></i>
          </div>
          <label class="change_label lightBlack" for="changeFN">Flight:
            <input type="text" id="changeFN" class="change-trip-details-fn-input int_input" v-model="intChangeData.returnFn" />
          </label>
        </div>
        <label for="YourComment" class="change-trip-details-otherneed lightBlack">Comments and other needs</label>
        <textarea class="change-trip-details-comment" id="YourComment" v-model="intChangeData.comments"></textarea>
        <button class="btn change-trip-details-btn" @click="submitChangeInt"
        :disabled="intChangeData.disabled" :class="intChangeData.disabled?'btn_disabled':'btn_active'">Submit</button>
      </div>
      <div class="change-trip-select" v-else >
        <div v-for="(item, index) in triplist" :key="index">
          <h4 class="change-trip-select-titel lightBlack" >
            {{item.voyageinfo[0].ds}} - {{item.voyageinfo[item.voyageinfo.length - 1].as}} {{getMonthDayYearString(new Date(item.voyageinfo[0].dt))}}
          </h4>
          <template v-if="item.travellerinfo && item.travellerinfo.length >= 1" >
            <div v-for="(travel, index2) in item.travellerinfo" :key="index2">
              <SelectTravel :travel="travel" :totalPeople="changeData.totalPeople[index]"
              :ticketInfo="item.ticketsinfo[0][index2]" :forId="'change-checkbox'+index" :index="index" :index2="index2"/>
            </div>
          </template>
          <div class="change-trip-details" v-if="item.isChangeable">
            <div class="change_label lightBlack">Change to date:
              <p class="change-trip-details-date-input" @click="showDateModel = true;goOrfrom = index+1;">
                {{changeData.departDate[index]}}
              </p>
              <i class="s-icon s-icon-datadown" @click="showDateModel = true;goOrfrom = index+1;"></i>
            </div>
            <label class="change_label lightBlack" for="changeFN">Change to flight:
              <input type="text" id="changeFN" class="change-trip-details-fn-input" v-model="changeData.fn[index]" />
            </label>
          </div>
        </div>
        <label for="YourComment" class="change-trip-details-otherneed lightBlack">Comments and other needs</label>
        <textarea class="change-trip-details-comment" id="YourComment" v-model="changeData.comments"></textarea>
        <button class="btn change-trip-details-btn" @click="submitChangeInfo"
        :disabled="changeData.disabled" :class="changeData.disabled?'btn_disabled':'btn_active'" >Submit</button>
      </div>
      <SelectDate v-show="showDateModel" :goOrfrom="goOrfrom" :selectedDate="previousDate"
        @closeDateModel="closeDateModel" @changeDate="changeDate" />
    </div>
  </div>
</template>
<script>
import { ScrollToPageTop } from '@/utils/ScrollToPageTop';
import { mapState } from 'vuex';
import { Toast } from 'mint-ui';
import { applyForRebookTogether } from '@/constants/ApiConstants';
import { getMonthDayYearString } from '@/utils/DateFormatUtils';
import { DeleteArrayRepeat } from '@/utils/DeleteArrayRepeat';
export default {
  props: ['tripId'],
  components: {
    SelectTravel: () => import('./CancelSelect.vue'),
    SelectDate: () => import('./Calendar.vue'),
  },
  data () {
    return {
      getMonthDayYearString,
      showDateModel: false,
      goOrfrom: 1,
      changeTrip: [],
      changeIntTrip: [],
      selectChangePeople: [],
      selectIntChangePeople: [],
      previousDate: '',
      changeData: {
        totalPeople: {},
        comments: '',
        departDate: ['', ''],
        fn: ['', ''],
        disabled: true
      },
      intChangeData: {
        totalPeople: [],
        comments: '',
        departDate: '',
        departFn: '',
        returnDate: '',
        returnFn: '',
        disabled: true
      }
    };
  },
  computed: {
    ...mapState({
      triplist: state => state.MyTripList.tripDetailInfo.triplist,
      tripInfo: state => state.MyTripList.tripInfo,
      orderInfo: state => state.MyTripList.orderInfo
    }),
  },
  watch: {
    triplist (val) {
      if (val) {
        val.forEach((e, i) => {
          let arr = [];
          e.travellerinfo.forEach((t, j) => {
            let obj = {
              checked: Number(t.status) === 1,
              name: t.name,
              id: t.travellerId
            };
            arr.push(obj)
          })
          this.$set(this.changeData.totalPeople, i, arr);
        })
      }
    },
    tripInfo (val) {
      if (val) {
        val.travellerinfo.forEach((t, j) => {
          let obj = {
            checked: Number(t.status) === 1,
            name: t.name,
            id: t.travellerId
          };
          this.$set(this.intChangeData.totalPeople, j, obj);
        })
      }
    },
    changeData: {
      handler (val) {
        let flag1 = false;
        let flag2 = false;
        let index1;
        let index2;
        for (let key in val.totalPeople) {
          val.totalPeople[key].forEach(e => {
            if (Number(key) === 0 && e.checked) {
              flag1 = true;
              index1 = Number(key);
            }
            if (Number(key) === 1 && e.checked) {
              index2 = Number(key);
              flag2 = true;
            }
          })
        }
        if (index1 === 0 && flag1 && (!!val.departDate[0] && !!val.fn[0])) {
          val.disabled = false;
        } else if (index2 === 1 && flag2 && (!!val.departDate[1] && !!val.fn[1])) {
          val.disabled = false;
        } else {
          val.disabled = true;
        }
      },
      deep: true
    },
    intChangeData: {
      handler (val) {
        let flag = false;
        val.totalPeople.forEach(e => {
          if (e.checked) flag = true;
        })
        if (flag && ((!!val.departDate && !!val.departFn) || (!!val.returnDate && !!val.returnFn))) {
          val.disabled = false;
        } else {
          val.disabled = true;
        }
      },
      deep: true
    }
  },
  methods: {
    closeDateModel () {
      this.showDateModel = false;
    },
    changeDate (obj) {
      if (this.orderInfo.international && this.triplist.length > 1) {
        obj.type === 1 ? (this.intChangeData.departDate = obj.date)
          : this.intChangeData.returnDate = obj.date;
        this.showDateModel = false;
        this.previousDate = new Date(obj.date);
        let departT = this.intChangeData.departDate !== '' ? new Date(this.intChangeData.departDate).getTime() : false;
        let returnT = this.intChangeData.returnDate !== '' ? new Date(this.intChangeData.returnDate).getTime() : false;
        if (returnT) {
          if (returnT - departT < 0) {
            this.intChangeData.departDate = obj.date;
            this.intChangeData.returnDate = obj.date;
          }
        }
      } else {
        obj.type === 1 ? (this.changeData.departDate[0] = obj.date)
          : this.changeData.departDate[1] = obj.date;
        this.showDateModel = false;
        this.previousDate = new Date(obj.date);
        let departT = this.changeData.departDate[0] !== '' ? new Date(this.changeData.departDate[0]).getTime() : false;
        let returnT = this.changeData.departDate[1] !== '' ? new Date(this.changeData.departDate[1]).getTime() : false;
        if (returnT) {
          if (returnT - departT < 0) {
            this.changeData.departDate[0] = obj.date;
            this.changeData.departDate[1] = obj.date;
          }
        }
      }
    },
    checkChangeData () {
      this.changeTrip = [];
      this.selectChangePeople = [];
      for (let key in this.changeData.totalPeople) {
        let arr = [];
        let arr2 = [];
        this.changeData.totalPeople[key].forEach((e, i) => {
          let obj = {};
          if (e.checked) {
            obj['pId'] = e.id;
            arr.push(obj);
            arr2.push({
              tripType: Number(key) + 1,
              departDate: this.changeData.departDate[key],
              fno: this.changeData.fn[key],
              remark: this.changeData.comments
            });
          }
        })
        this.selectChangePeople.push(...arr);
        this.changeTrip.push(...arr2);
      }
      this.changeTrip = DeleteArrayRepeat(this.changeTrip, 'tripType');
      if (this.selectChangePeople.length === 0) {
        Toast('Please select a passenger to change flight');
        return false;
      }
      return true;
    },
    submitChangeInfo () {
      if (!this.checkChangeData()) return false;
      let data = {
        flights: this.changeTrip,
        travellers: this.selectChangePeople
      };
      this.$http.post(applyForRebookTogether, data).then(res => {
        if (res.code === 200 && res.succ) {
          Toast('Change Successfully');
          setTimeout(() => {
            this.$store.commit('saveSearchDetailInfo', this.tripId);
          }, 2000);
        } else {
          Toast(res.msg);
        }
      })
    },
    checkIntChangeData () {
      this.changeIntTrip = [];
      this.selectIntChangePeople = [];
      this.intChangeData.totalPeople.forEach((e, i) => {
        let obj = {};
        if (e.checked) {
          obj['pId'] = e.id;
          this.selectIntChangePeople.push(obj);
          this.selectIntChangePeople.push({
            pId: this.changeData.totalPeople[1][i].id
          });
          let data1 = {
            tripType: 1,
            departDate: this.intChangeData.departDate,
            fno: this.intChangeData.departFn,
            remark: this.intChangeData.comments
          };
          let data2;
          if (!!this.intChangeData.returnDate || !!this.intChangeData.returnFn) {
            data2 = {
              tripType: 2,
              departDate: this.intChangeData.returnDate,
              fno: this.intChangeData.returnFn,
              remark: this.intChangeData.comments
            };
          } else {
            data2 = {
              tripType: 2,
              departDate: this.intChangeData.departDate,
              fno: this.intChangeData.departFn,
              remark: this.intChangeData.comments
            };
          }
          let arr = [data1, data2];
          this.changeIntTrip.push(...arr);
        }
      })
      if (this.selectIntChangePeople.length === 0) {
        Toast('Please select a passenger to change flight');
        return false;
      }
      return true;
    },
    submitChangeInt () {
      if (!this.checkIntChangeData()) return false;
      let data = {
        flights: this.changeIntTrip,
        travellers: this.selectIntChangePeople
      };
      this.$http.post(applyForRebookTogether, data).then(res => {
        if (res.code === 200 && res.succ) {
          Toast('Change Successfully');
          setTimeout(() => {
            this.$store.commit('saveSearchDetailInfo', this.tripId);
          }, 2000);
        } else {
          Toast(res.msg);
        }
      })
    }
  },
  created () {
    this.$store.commit('saveSearchDetailInfo', this.tripId);
  },
  mounted () {
    ScrollToPageTop('change-trip-warp');
  },
};
</script>
<style lang="scss" scoped>
  .lightBlack{
   color: $lightBlack;
  }
  .lighterBlack{
    color: $lighterBlack;
  }
  .s-icon{
    vertical-align: middle;
    margin-right: 0.2rem;
  }
  .change-trip-warp{
    height:calc(100% - 1.2rem );
    overflow: auto;
    padding: 0 0.3rem 1.68rem;
    font-size: 0.24rem;
  }
  .chance_title{
    font-size:0.36rem;
    font-weight:bold;
    color:rgba(51,51,51,1);
    padding-bottom: 0.4rem;
    padding-top: 0.3rem;
  }
  .change-trip-select{
    margin-top: 0.3rem;
  }
  .change-trip-select-titel{
    margin: 0.3rem 0;
  }
  .change-trip-details-title,
  .change-trip-select-titel{
    font-weight: 700;
  }
  .change-trip-select-travele{
    height:0.3rem;
    line-height: 0.3rem;
    margin: 0.2rem 0;
  }
  .select_user{
    display:inline-block;
    line-height: 0.3rem;
  }
  .change-trip-select-travele-changing{
    display: flex;
  }
  .change-trip-select-travele-name{
    width: 80%;
  }
  .change-trip-select-travele-status{
    width: 20%;
    text-align: right;
  }
  .int_notice{
    color:#999;
    font-size: 0.22rem;
    line-height: 0.33rem;
    letter-spacing: 0.5px;
    margin-top: 0.3rem;
  }
  .change_label{
    display: block;
    height:0.6rem;
    line-height: 0.6rem;
    margin-bottom: 0.3rem;
    font-size: 0.24rem;
    color:$lightBlack;
    position: relative;
    .s-icon{
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      cursor: pointer;
    }
  }
  .change-trip-details-date-input,
  .change-trip-details-fn-input{
    float: right;
    width:4.24rem;
    height:100%;
    padding-left:0.3rem;
    border-radius:0.08rem;
    background:rgba(234,234,234,1);
    &:focus{
      background: #fafafa;
      border:0.01rem solid $green;
    }
  }
  .change-trip-details-date-input{
    cursor: pointer;
  }
  .int_input{
    width:5.6rem;
  }
  .change-trip-details-comment{
    width: 100%;
    min-height:3rem;
    background:rgba(250,250,250,1);
    border-radius:0.12rem;
    border:0.01rem solid rgba(220,220,220,1);
    padding: 0.2rem;
    margin: 0.2rem 0 0.4rem;
    resize: none;
    &:focus{
      background: #fafafa;
      border:0.01rem solid $green;
    }
  }
  .change-trip-details-otherneed{
    font-weight: 700;
  }
  .change-trip-details-btn{
    width: 100%;
    height:0.9rem;
    border-radius:0.12rem;
    font-size:0.36rem;
    font-weight:bold;
    color:rgba(255,255,255,1);
    line-height:0.9rem;
    text-align: center;
    &:active{
      background:#CB9323;
    }
  }
  .btn_disabled{
    background: #eee;
  }
  .btn_active{
    background:rgba(227,164,40,1);
  }
</style>
