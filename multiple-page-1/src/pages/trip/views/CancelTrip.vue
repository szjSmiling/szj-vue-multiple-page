<template>
  <div class="cancel-trip-warp scrollY">
    <div v-if="!sendOTP">
      <h4 class="cancel_title">Cancel Trip</h4>
      <p>
        <span class="cancel-trip-title lighterBlack">Order ID : </span>
        <span class="cancel-trip-title lightBlack">{{tripId}}</span>
      </p>
      <div class="cancel-trip-select" v-if="orderInfo.international && triplist.length > 1" >
        <h4 class="cancel-trip-select-titel lightBlack">
          {{tripInfo.voyageinfo[0].ds}} - {{tripInfo.voyageinfo[tripInfo.voyageinfo.length - 1].as}} {{getMonthDayYearString(new Date(tripInfo.voyageinfo[0].dt))}}
        </h4>
        <template v-if="tripInfo.travellerinfo && tripInfo.travellerinfo.length >= 1" >
          <div v-for="(travel, index2) in tripInfo.travellerinfo" :key="index2">
            <SelectTravel :travel="travel" :totalPeople="totalIntPeople"
            :ticketInfo="tripInfo.ticketsinfo[0][index2]" :forId="'cancel-checkbox0'" :index="0" :index2="index2" />
          </div>
        </template>
      </div>
      <div class="cancel-trip-select" v-else >
        <div v-for="(item, index) in triplist" :key="index">
          <h4 class="cancel-trip-select-titel lightBlack">
            {{item.voyageinfo[0].ds}} - {{item.voyageinfo[item.voyageinfo.length -1].as}} {{getMonthDayYearString(new Date(item.voyageinfo[0].dt))}}
          </h4>
          <template v-if="item.travellerinfo && item.travellerinfo.length >= 1" >
            <div v-for="(travel, index2) in item.travellerinfo" :key="index2">
              <SelectTravel :travel="travel" :totalPeople="totalPeople[index]"
              :ticketInfo="item.ticketsinfo[0][index2]" :forId="'cancel-checkbox'+index" :index="index" :index2="index2" />
            </div>
          </template>
        </div>
      </div>
      <p class="int_notice">For international flights, trips has to be operated altogether.</p>
      <div class="cancel-trip-details">
        <p class="cancel-trip-details-title lightBlack">Select Cancellation Reason</p>
        <div class="cancel-trip-details-reason">
          <template v-for="(item, key) in cancelReasons" >
            <div class="cancel-trip-details-reason-item" :key="key">
              <label :for="item.reason" class="cancel-trip-details-label" >
                <i class="s-icon" :class="selectReason === item.reasonType ? 's-icon-checked' : 's-icon-unchecked'"></i>
                &nbsp;{{item.reason}}
                <input class="reason" type="radio" :id="item.reason" :value="item.reasonType" v-model="selectReason"/>
              </label>
              <div v-if="selectReason === item.reasonType && item.isNeedStampCopy" class="cancel-trip-details-reason-item cancel-trip-details-uploadfile">
                <p class="cancel-trip-details-uploadfile-text">To proceed your request, airline requests stamp copy or screenshot of SMS/Email that proves the cancellation or re-schedule of your flight.</p>
                <p class="cancel-trip-details-uploadfile-title">Attach File: </p>
                <label v-show="showUpload" for="uploadfile" class="cancel-trip-details-uploadfile-label">Upload</label>
                <input v-show="showUpload" type="file" class="hide" name="file" id="uploadfile" @change="upLoadFile"/>
                <div v-show="!showUpload">
                  <div class="uploading_file_box">
                    <p class="uploading_file_name ellipsis" v-if="file && showUploading">
                      <i class="s-icon s-icon-file"></i>{{file.name}}
                    </p>
                    <p class="uploading_file_name2 ellipsis" v-if="file && !showUploading">
                      <i class="s-icon s-icon-right"></i>{{file.name}}
                    </p>
                    <p class="uploading_file_loading" v-if="showUploading">Uploading</p>
                    <button class="uploading_file_remove" v-else @click="removeUploadFile">Remove</button>
                  </div>
                  <UploadProcess v-if="showProcess" :uploadParams="uploadParams" />
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
      <div class="cancel-trip-details-policy">
        <p class="cancel-trip-select-titel lightBlack">Cancellation Policy</p>
        <ul class="cancel-trip-details-policy-text">
          <li class="cancel-trip-details-policy-text-item">In case of flown tickets, no refund will be applicable.</li>
          <li class="cancel-trip-details-policy-text-item">Fare will be refunded to the account used for booking.</li>
          <li class="cancel-trip-details-policy-text-item">The refund amount calculated is based on the fare rules &amp; restrictions and flight booking policy, hence the final amount may vary from the original price.</li>
          <li class="cancel-trip-details-policy-text-item">
            <p>Refund will be processed in sequence below as per the mode of payment you opted while booking:</p>
            <p>1. Happy Silver</p>
            <p>2. Happy Gold</p>
            <p>3. Account/Cards</p>
          </li>
          <li class="cancel-trip-details-policy-text-item">Coupon applied will be deducted from the refundable amount.</li>
        </ul>
        <p class="cancel-trip-details-policy-text-item">After cancellation, HEG will send you the complete break.</p>
      </div>
      <div class="cancel-trip-details-submit">
        <button class="cancel-trip-details-submit-btn" @click.prevent="submitCancel">Submit</button>
      </div>
    </div>
    <SendOTP v-else :OTPdata="OTPdata" :contactPhone="contactPhone" :tripId="tripId" @cancelSuccess="cancelSuccess" @giveUpCancel="giveUpCancel" />
  </div>
</template>
<script>
import { ScrollToPageTop } from '@/utils/ScrollToPageTop';
import { getRefundReason } from '@/constants/ApiConstants';
import { getMonthDayYearString } from '@/utils/DateFormatUtils';
import { Toast } from 'mint-ui';
import { mapState } from 'vuex';
export default {
  props: ['tripId'],
  components: {
    SelectTravel: () => import('./CancelSelect.vue'),
    UploadProcess: () => import('@/components/UploadProcess'),
    SendOTP: () => import('./SendOTP')
  },
  data () {
    return {
      getMonthDayYearString,
      sendOTP: false,
      OTPdata: {},
      totalPeople: {},
      totalIntPeople: [],
      selectChangePeople: [],
      selectIntChangePeople: [],
      selectReason: null,
      showUpload: true,
      showUploading: true,
      file: null,
      stampCopyUrl: '',
      cancelReasons: [],
      upStartTime: null,
      upEndTime: null,
      showProcess: false,
      uploadParams: {
        upProcess: 0,
        startText: '',
        endText: ''
      }
    };
  },
  computed: {
    ...mapState({
      triplist: state => state.MyTripList.tripDetailInfo.triplist,
      tripInfo: state => state.MyTripList.tripInfo,
      orderInfo: state => state.MyTripList.orderInfo,
      contactPhone: state => state.MyTripList.tripInfo.contactMob
    })
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
          this.$set(this.totalPeople, i, arr);
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
          this.$set(this.totalIntPeople, j, obj);
        })
      }
    }
  },
  methods: {
    giveUpCancel () {
      this.sendOTP = false;
    },
    cancelSuccess () {
      this.sendOTP = false;
      this.$store.commit('saveSearchDetailInfo', this.tripId);
    },
    beforeUploadFile () {
      const isNeedUpload = this.cancelReasons[this.selectReason].isNeedStampCopy;
      if (isNeedUpload && !this.file) { // 需要上传，但没选择文件，需提示
        Toast({
          message: 'Kindly attach airline request stamped copy or screenshot of the SMS/email proving the cancellation or rescheduling of your flight to apply for refund.',
          duration: 5000
        })
        return false;
      }
      if (isNeedUpload && this.file) { // 检查是否大于size
        const size = this.file.size / 1024;
        if (size > 10240) {
          Toast({
            message: 'The files should not be larger than 10 mb',
            duration: 2000,
          })
          return false;
        }
      }
      return true;
    },
    upLoadFile (files) {
      // 上传开始的时间
      this.upStartTime = Date.parse(new Date());
      this.file = files.srcElement.files[0];
      if (!this.beforeUploadFile()) return;
      this.addUploadProcessAnimate(2000, 70);
      this.showUpload = false;
      this.showProcess = true;
      let data = new FormData();
      data.append('file', this.file);
      data.append('typeId', 'ca72e59c-409b-11e9-93e2-000c29231d9f');
      this.$http('/oss_api/upload/extract.do', {
        method: 'POST',
        body: data
      }).then(res => {
        if (res.code === '200') {
          // 上传结束的时间
          this.upEndTime = Date.parse(new Date());
          let time = this.upEndTime - this.upStartTime - 2000;
          this.addUploadProcessAnimate(time, 20);
          this.uploadParams.upProcess = 100;
          this.stampCopyUrl = res.data.path;
          setTimeout(() => {
            this.showProcess = false;
            this.showUploading = false;
          }, 500)
        } else {
          Toast(res);
          this.file = null;
          this.stampCopyUrl = '';
          this.showUpload = true;
          this.showUploading = true;
          this.uploadParams.upProcess = 0;
          this.showProcess = false;
        }
      });
    },
    removeUploadFile () {
      this.file = null;
      this.stampCopyUrl = '';
      this.showUpload = true;
      this.showUploading = true;
      this.uploadParams.upProcess = 0;
      this.showProcess = false;
    },
    checkSubmitData () {
      this.selectChangePeople = [];
      for (let key in this.totalPeople) {
        let arr = [];
        this.totalPeople[key].forEach((e, i) => {
          let obj = {};
          if (e.checked) {
            obj['pId'] = e.id;
            arr.push(obj);
          }
        })
        this.selectChangePeople.push(...arr);
      }
      if (this.selectChangePeople.length === 0) {
        Toast('Please select a passenger to change flight');
        return false;
      }
      return true;
    },
    checkSubmitDataInt () {
      this.selectIntChangePeople = [];
      this.totalIntPeople.forEach((e, i) => {
        let obj = {};
        if (e.checked) {
          obj['pId'] = e.id;
          this.selectIntChangePeople.push(obj);
          this.selectIntChangePeople.push({
            pId: this.totalPeople[1][i].id
          });
        }
      })
      if (this.selectIntChangePeople.length === 0) {
        Toast('Please select a passenger to change flight');
        return false;
      }
      return true;
    },
    submitCancel () {
      if (!this.beforeUploadFile()) return;
      if (this.orderInfo.international && this.triplist.length > 1) {
        if (!this.checkSubmitDataInt()) return;
        this.OTPdata = {
          reasonType: this.selectReason,
          travellers: this.selectIntChangePeople
        };
      } else {
        if (!this.checkSubmitData()) return;
        this.OTPdata = {
          reasonType: this.selectReason,
          travellers: this.selectChangePeople
        };
      }
      if (this.cancelReasons[this.selectReason].isNeedStampCopy) {
        this.OTPdata['stampCopyUrl'] = this.stampCopyUrl;
      }
      this.sendOTP = true;
    },
    addUploadProcessAnimate (time, process) {
      if (time <= 0) {
        return false;
      }
      let num = parseInt(time / process);
      this.uploadParams.upProcess = 0;
      let timer = setInterval(() => {
        this.uploadParams.upProcess++;
        if (this.uploadParams.upProcess >= process || this.uploadParams.upProcess >= 100) {
          clearInterval(timer);
        }
      }, num);
    }
  },
  created () {
    this.$store.commit('saveSearchDetailInfo', this.tripId);
    this.$http(getRefundReason).then(res => {
      if (res.code === 200 && res.data.length > 0) {
        this.cancelReasons = res.data;
        this.selectReason = res.data[0].reasonType;
      } else {
        Toast(res);
      }
    })
  },
  mounted () {
    ScrollToPageTop('cancel-trip-warp');
  }
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
  .cancel-trip-warp{
    padding: 0 0.3rem 1.68rem;
    font-size: 0.24rem;
  }
  .cancel_title{
    font-size:0.36rem;
    font-weight:bold;
    color:rgba(51,51,51,1);
    padding-bottom: 0.4rem;
    padding-top: 0.3rem;
  }
  .cancel-trip-select{
    margin-top: 0.3rem;
  }
  .cancel-trip-select-travele{
    margin-bottom: 0.2rem;
  }
  .select_user{
    display: inline-block;
    font-size: 0.24rem;
    height: 16px;
    line-height: 16px;
  }
  .cancel-trip-details-title,
  .cancel-trip-select-titel{
    margin: 0.3rem 0;
    font-weight: 700;
  }
  .cancel-trip-details-reason-item{
    margin-bottom: 0.3rem;
  }
  .cancel-trip-details-label{
    display: inline-block;
    font-size:0.24rem;
    line-height: 16px;
    color:rgba(102,102,102,1);
    position: relative;
  }
  .int_notice{
    color:#999;
    font-size: 0.22rem;
    line-height: 0.33rem;
    letter-spacing: 0.5px;
    margin-top: 0.3rem;
  }
  .reason{
    position: absolute;
    left: 0;
    width:16px;
    height:16px;
    opacity: 0;
  }
  .cancel-trip-details-uploadfile-text{
    font-size:0.22rem;
    color:rgba(153,153,153,1);
    line-height:0.33rem;
    margin: 0.3rem 0;
  }
  .cancel-trip-details-uploadfile-title{
    font-size:0.24rem;
    font-weight:bold;
    color:rgba(102,102,102,1);
    line-height:0.3rem;
    margin-bottom: 0.2rem;
  }
  .cancel-trip-details-uploadfile-label{
    display: inline-block;
    width:1.57rem;
    height:0.44rem;
    background:rgba(227,164,40,1);
    border-radius:0.04rem;
    font-size:0.24rem;
    font-weight:bold;
    color:rgba(255,255,255,1);
    line-height:0.44rem;
    text-align: center;
  }
  .cancel-trip-details-policy-text{
    padding-left: 0.3rem;
  }
  .cancel-trip-details-policy-text-item{
    font-size:0.22rem;
    color:rgba(153,153,153,1);
    line-height:0.33rem;
    margin-bottom: 0.15rem;
    list-style: disc;
    &>p{
      line-height: 0.3rem;
      color:rgba(153,153,153,1);
    }
  }
  .cancel-trip-details-submit{
    text-align: center;
    margin: 0.4rem 0 0;
  }
  .cancel-trip-details-submit-btn{
    width:6.2rem;
    height:0.9rem;
    background:rgba(227,164,40,1);
    border-radius:0.12rem;
    font-size:0.36rem;
    font-weight:bold;
    color:rgba(255,255,255,1);
    line-height:0.9rem;
    &:active{
      background:#CB9323;
    }
  }
  // fileupload
  .uploading_file_box {
    height:0.44rem;
    @include flexCenter;
    justify-content: space-between;
  }
  .uploading_file_name, .uploading_file_loading{
    color:$lighterBlack;
    font-size: 0.2rem;
    line-height: 0.25rem;
  }
  .uploading_file_name{
    width:5.4rem;
  }
  .uploading_file_name2{
    width:5.4rem;
    color:$black;
    font-size: 0.24rem;
    line-height: 0.3rem;
  }
  .uploading_file_remove{
    color:$green;
    cursor: pointer;
    background: transparent;
  }
</style>
