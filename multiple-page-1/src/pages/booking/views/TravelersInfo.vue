<template>
  <div class="travelers-info">
    <div class="d_jump" v-for="(adult, A_index) in adultsInfo" :key="A_index">
      <p class="traveler-info-title">Traveler {{A_index+1}} : Adult</p>
        <div class="travelers-info-sex">
          <label class="s-traveler-general travelers-info-sex-label"><i class="s-icon" :class="adult.sex == 0 ? 's-icon-checked' : 's-icon-unchecked'"></i>&nbsp;Male
          <input :name="`sex_adult_${A_index}`" class="hide" type="radio" value="0" v-model="adult.sex"/> </label>
          <label class="s-traveler-general travelers-info-sex-label"><i class="s-icon" :class="adult.sex == 1 ? 's-icon-checked' : 's-icon-unchecked'"></i>&nbsp;Female
          <input :name="`sex_adult_${A_index}`" class="hide" value="1" v-model="adult.sex" type="radio" /></label>
        </div>
        <div class="travelers-info-name">
          <div class="relative">
            <label for="" class="s-traveler-general ">First Name</label>
            <input type="text" :name="'Fname_A_'+ A_index" v-validate="'required|name'"
            v-model="adult.passengerFirstName"
            class="travelers-info-name-input"
            :class="{'red-border': errors.has('Fname_A_'+ A_index)}"
            @focus="inputFocus('Fname_A_'+ A_index)"
            @blur="inputBlur('Fname_A_'+ A_index)"

            >
            <span class="errorText" :class="focusInput === 'Fname_A_'+ A_index ? 'hide' : '' " v-show="errors.has('Fname_A_'+ A_index)">{{ errors.first('Fname_A_'+ A_index) }}</span>
          </div>
          <div class="relative">
            <label for="" class="s-traveler-general">Last Name</label>
            <input type="text"
            :name="'Lname_A_'+ A_index"
            v-validate="'required|name'"
            v-model="adult.passengerLastName"
            class="travelers-info-name-input"
            :class="{'red-border': errors.has('Lname_A_'+ A_index)}"
            @focus="inputFocus('Lname_A_'+ A_index)"
            @blur="inputBlur('Lname_A_'+ A_index)"
            >
            <span class="errorText" :class="focusInput === 'Lname_A_'+ A_index ? 'hide' : '' " v-show="errors.has('Lname_A_'+ A_index)">{{ errors.first('Lname_A_'+ A_index) }}</span>
          </div>
        </div>
        <div v-if="flightInfo.birthdateRequired">
          <div class="relative">
            <label for="" class="s-traveler-general">Date of Birth</label>
            <div class="travelers-info-date-box">{{adult.birthDate}}
              <input
              type="date"
              v-model="adult.birthDate"
              class="travelers-info-date-input"
              :name="'birthDate_A_'+ A_index"
              v-validate="'required|date_format:yyyy-MM-dd'">
              <i class="s-icon s-icon-datadown"></i>
            </div>
            <span class="errorText" v-show="errors.has('birthDate_A_'+ A_index)">{{ errors.first('birthDate_A_'+ A_index) }}</span>
          </div>
        </div>
        <div class="passport-info-date" v-if="isPassPort">
          <div class="relative">
            <label for="" class="s-traveler-general">Nationality</label>
            <div class="travelers-info-date-box">{{adult.country}}
              <select :name="'nationality_A_'+ A_index" class="travelers-info-date-input" v-model="adult.country" v-validate="'required'">
                <option v-for="(country, index) in countrylist" :key="index" :value="country.code">
                  {{country.name}}
                </option>
              </select>
              <i class="s-icon s-icon-datadown"></i>
            </div>
            <span class="errorText" v-show="errors.has('nationality_A_'+ A_index)">{{ errors.first('nationality_A_'+ A_index) }}</span>
          </div>
          <div class="passport-info-date-box relative">
            <label for="" class="s-traveler-general">Passport No.</label>
            <input type="text"
            :name="'passportNo_A_' + A_index"
            v-validate="'required|passportNo'"
            v-model="adult.cardNo"
            class="travelers-info-name-input"
            :class="{'red-border': errors.has('passportNo_A_' + A_index)}"
            @focus="inputFocus('passportNo_A_'+ A_index)"
            @blur="inputBlur('passportNo_A_'+ A_index)"
            >
            <span class="errorText" :class="focusInput === 'passportNo_A_'+ A_index ? 'hide' : '' " v-show="errors.has('passportNo_A_'+ A_index)">{{ errors.first('passportNo_A_'+ A_index) }}</span>
          </div>
          <div class="relative">
            <label for="" class="s-traveler-general">Passport Expiry Date</label>
            <div class="travelers-info-date-box">{{adult.cardValid}}
              <input type="date"
              v-model="adult.cardValid"
              :name="'passPortDate_A_' + A_index"
              class="travelers-info-date-input" v-validate="'required|date_format:yyyy-MM-dd'">
              <i class="s-icon s-icon-datadown"></i>
            </div>
            <span class="errorText" v-show="errors.has('passPortDate_A_'+ A_index)">{{ errors.first('passPortDate_A_'+ A_index) }}</span>
          </div>
        </div>
    </div>
    <div v-for="(child, C_index) in childsInfo" :key="C_index + adults">
      <p class="traveler-info-title">Traveler {{C_index+1 +  adults}} : Child</p>
        <div class="travelers-info-sex">
          <label  class="s-traveler-general travelers-info-sex-label">
            <i class="s-icon" :class="child.sex == 0 ? 's-icon-checked' : 's-icon-unchecked'"></i>&nbsp;Male
            <input :name="`sex_child_${C_index}`" class="hide" type="radio" value="0" v-model="child.sex"/>
          </label>
          <label class="s-traveler-general travelers-info-sex-label">
            <i class="s-icon" :class="child.sex == 1 ? 's-icon-checked' : 's-icon-unchecked'"></i>&nbsp;Female
            <input :name="`sex_child_${C_index}`" class="hide" value="1" v-model="child.sex" type="radio" />
          </label>
        </div>
        <div class="travelers-info-name">
          <div class="relative">
            <label for="" class="s-traveler-general ">First Name</label>
            <input type="text"
            :name="'Fname_C_'+ C_index"
            v-validate="'required|name'"
            v-model="child.passengerFirstName"
            class="travelers-info-name-input"
            :class="{'red-border': errors.has('Fname_C_'+ C_index)}"
            @focus="inputFocus('Fname_C_'+ C_index)" @blur="inputBlur('Fname_C_'+ C_index)">
            <span class="errorText" :class="focusInput === 'Fname_C_'+ C_index ? 'hide' : '' " v-show="errors.has('Fname_C_'+ C_index)">{{ errors.first('Fname_C_'+ C_index) }}</span>
          </div>
          <div class="relative">
             <label for="" class="s-traveler-general">Last Name</label>
            <input type="text"
            :name="'Lname_C_'+ C_index"
            v-validate="'required|name'"
            v-model="child.passengerLastName"
            class="travelers-info-name-input"
            :class="{'red-border': errors.has('Lname_C_'+ C_index)}"
            @focus="inputFocus('Lname_C_'+ C_index)"
            @blur="inputBlur('Lname_C_'+ C_index)">
            <span class="errorText" :class="focusInput === 'Lname_C_'+ C_index ? 'hide' : '' " v-show="errors.has('Lname_C_'+ C_index)">{{ errors.first('Lname_C_'+ C_index) }}</span>
          </div>
        </div>
        <div>
          <div class="relative">
            <label for="" class="s-traveler-general">Date of Birth</label>
            <div class="travelers-info-date-box">{{child.birthDate}}
              <input type="date"
              v-model="child.birthDate"
              class="travelers-info-date-input"
              :name="'birthDate_C_'+ C_index"
              v-validate="'required|date_format:yyyy-MM-dd'">
              <i class="s-icon s-icon-datadown"></i>
            </div>
            <span class="errorText" v-show="errors.has('birthDate_C_'+ C_index)">{{ errors.first('birthDate_C_'+ C_index) }}</span>
          </div>
        </div>
        <div class="passport-info-date" v-if="isPassPort">
          <div class="relative">
            <label for="" class="s-traveler-general">Nationality</label>
            <div class="travelers-info-date-box">{{child.country}}
              <select :name="'nationality_C_'+ C_index" class="travelers-info-date-input" v-model="child.country" v-validate="'required'">
                <option v-for="(country, index) in countrylist" :key="index" :value="country.code">
                  {{country.name}}
                </option>
              </select>
              <i class="s-icon s-icon-datadown"></i>
            </div>
            <span class="errorText" v-show="errors.has('nationality_C_'+ C_index)">{{ errors.first('nationality_C_'+ C_index) }}</span>
          </div>
          <div class="passport-info-date-box relative">
            <label for="" class="s-traveler-general">Passport No.</label>
            <input type="text"
            :name="'passportNo_C_' + C_index"
            v-validate="'required|passportNo'"
            v-model="child.cardNo"
            class="travelers-info-name-input"
            :class="{'red-border': errors.has('passportNo_C_'+ C_index)}"
            @focus="inputFocus('passportNo_C_'+ C_index)"
            @blur="inputBlur('passportNo_C_'+ C_index)">
            <span class="errorText"
            :class="focusInput === 'passportNo_C_'+ C_index ? 'hide' : '' " v-show="errors.has('passportNo_C_'+ C_index)">{{ errors.first('passportNo_C_'+ C_index) }}</span>
          </div>
          <div class="relative">
            <label for="" class="s-traveler-general">Passport Expiry Date</label>
            <div class="travelers-info-date-box">{{child.cardValid}}
              <input type="date" v-model="child.cardValid" :name="'passPortDate_C_' + C_index" class="travelers-info-date-input" v-validate="'required|date_format:yyyy-MM-dd'">
              <i class="s-icon s-icon-datadown"></i>
            </div>
            <span class="errorText" v-show="errors.has('passPortDate_C_'+ C_index)">{{ errors.first('passPortDate_C_'+ C_index) }}</span>
          </div>
        </div>
    </div>
    <div v-for="(baby, B_index) in babysInfo" :key="B_index +  adults + childs">
      <p class="traveler-info-title">Traveler {{B_index +1+  adults + childs}} : Baby</p>
        <div class="travelers-info-sex">
          <label class="s-traveler-general travelers-info-sex-label">
            <i class="s-icon" :class="baby.sex == 0 ? 's-icon-checked' : 's-icon-unchecked'"></i>&nbsp;Male
            <input :name="`sex_baby_${B_index}`" class="hide" type="radio" value="0" v-model="baby.sex"/>
          </label>
          <label class="s-traveler-general travelers-info-sex-label">
            <i class="s-icon" :class="baby.sex == 1 ? 's-icon-checked' : 's-icon-unchecked'"></i>&nbsp;Female
            <input :name="`sex_baby_${B_index}`" class="hide" value="1" v-model="baby.sex" type="radio" />
          </label>
        </div>
        <div class="travelers-info-name">
          <div class="relative">
            <label for="" class="s-traveler-general ">First Name</label>
            <input type="text"
              :name="'Fname_B_'+ B_index"
              v-validate="'required|name'"
              v-model="baby.passengerFirstName"
              class="travelers-info-name-input"
              :class="{'red-border': errors.has('Fname_B_'+ B_index)}"
              @focus="inputFocus('Fname_B_'+ B_index)"
              @blur="inputBlur('Fname_B_'+ B_index)">
            <span class="errorText" :class="focusInput === 'Fname_B_'+ B_index ? 'hide' : '' " v-show="errors.has('Fname_B_'+ B_index)">{{ errors.first('Fname_B_'+ B_index) }}</span>
          </div>
          <div class="relative">
            <label for="" class="s-traveler-general">Last Name</label>
            <input type="text"
            :name="'Lname_B_'+ B_index"
            v-validate="'required|name'"
            v-model="baby.passengerLastName"
            class="travelers-info-name-input"
            :class="{'red-border': errors.has('Lname_B_'+ B_index)}"
            @focus="inputFocus('Lname_B_'+ B_index)"
            @blur="inputBlur('Lname_B_'+ B_index)">
            <span class="errorText" :class="focusInput === 'Lname_B_'+ B_index ? 'hide' : '' "  v-show="errors.has('Lname_B_'+ B_index)">{{ errors.first('Lname_B_'+ B_index) }}</span>
          </div>
        </div>
        <div>
          <div class="relative">
            <label for="" class="s-traveler-general">Date of Birth</label>
            <div class="travelers-info-date-box">{{baby.birthDate}}
              <input type="date" v-model="baby.birthDate" class="travelers-info-date-input" :name="'birthDate_B_'+ B_index" v-validate="'required|date_format:yyyy-MM-dd'">
              <i class="s-icon s-icon-datadown"></i>
            </div>
            <span class="errorText" v-show="errors.has('birthDate_B_'+ B_index)">{{ errors.first('birthDate_B_'+ B_index) }}</span>
          </div>
        </div>
        <div class="passport-info-date" v-if="isPassPort">
          <div class="relative">
            <label for="" class="s-traveler-general">Nationality</label>
            <div class="travelers-info-date-box">{{baby.country}}
              <select class="travelers-info-date-input" v-model="baby.country" :name="'nationality_B_'+ B_index" v-validate="'required'">
                <option v-for="(country, index) in countrylist" :key="index" :value="country.code">
                  {{country.name}}
                </option>
              </select>
              <i class="s-icon s-icon-datadown"></i>
            </div>
            <span class="errorText" v-show="errors.has('nationality_B_'+ B_index)">{{ errors.first('nationality_B_'+ B_index) }}</span>
          </div>
          <div class="passport-info-date-box relative">
            <label for="" class="s-traveler-general">Passport No.</label>
            <input type="text"
            :name="'passportNo_B_' + B_index"
            v-validate="'required|passportNo'"
            v-model="baby.cardNo"
            class="travelers-info-name-input"
            :class="{'red-border': errors.has('passportNo_B_'+ B_index)}"
            @focus="inputFocus('passportNo_B_'+ B_index)"
            @blur="inputBlur('passportNo_B_'+ B_index)">
            <span class="errorText" :class="focusInput === 'passportNo_B_'+ B_index ? 'hide' : '' " v-show="errors.has('passportNo_B_'+ B_index)">{{ errors.first('passportNo_B_'+ B_index) }}</span>
          </div>
          <div class="relative">
            <label for="" class="s-traveler-general">Passport Expiry Date</label>
            <div class="travelers-info-date-box">{{baby.cardValid}}
              <input type="date"
              v-model="baby.cardValid"
              :name="'passPortDate_B_'+ B_index"
              class="travelers-info-date-input"
              v-validate="'required|date_format:yyyy-MM-dd'">
              <i class="s-icon s-icon-datadown"></i>
            </div>
            <span class="errorText" v-show="errors.has('passPortDate_B_'+ B_index)">{{ errors.first('passPortDate_B_'+ B_index) }}</span>
          </div>
        </div>
    </div>
  </div>
</template>

<script>

import { Validator } from 'vee-validate';
import EventHub from '@/utils/EventHub';
import { checkPassport, searchCountry } from '@/constants/ApiConstants';
/**
 * dict : 设置 为空时的验证规则
 */
const dict = {
  en: {
    messages: {
      required: () => `This field is required`,
      date_format: () => `This field is required`,
    }
  }
};

Validator.localize(dict);

export default {
  props: ['flightInfo'],
  data () {
    return {
      isChecked: 0,
      birthDate: '',
      cardValid: '',
      countrylist: [],
      country: '',
      adults: 0,
      childs: 0,
      babys: 0,
      isPassPort: false,
      adultsInfo: [],
      childsInfo: [],
      babysInfo: [],
      focusInput: '',
      timerScroll: null
    }
  },
  methods: {
    scrollToErrDiv (index) {
      var top = document.getElementsByClassName('d_jump');
      let that = this;
      cancelAnimationFrame(this.timerScroll);
      this.timerScroll = requestAnimationFrame(function fn () {
        let oTop = document.body.scrollTop || document.documentElement.scrollTop;
        if (oTop > top[index].offsetTop) {
          document.body.scrollTop = document.documentElement.scrollTop = top[index].offsetTop - 50;
          that.timerScroll = requestAnimationFrame(fn);
        } else {
          cancelAnimationFrame(that.timerScroll);
        }
      });
    },
    getPassPortFlag (paramet) {
      this.$http.post(checkPassport, paramet).then((res) => {
        this.isPassPort = res.data[0].passportPolicy;
      });
    },
    inputFocus (name) {
      this.focusInput = name;
    },
    inputBlur (name) {
      this.focusInput = '';
    },
    setTravelerInfo (trave, type) {
      let traveInfo = [];
      for (let index = 0; index < trave; index++) {
        const Obj = {
          sex: 0,
          passengerFirstName: '',
          passengerLastName: '',
          passengerType: type,
          birthDate: '',
          country: '',
          cardNo: '',
          cardValid: '',
          cardType: 1,
        };
        traveInfo.push(Obj);
      }
      return traveInfo;
    },
  },
  created () {
    this.$http(searchCountry).then((res) => {
      this.countrylist = res.data;
    });

    EventHub.$on('sendTraveInfo', (res) => {
      if (res) {
        this.$validator.validateAll().then((result) => {
          if (result) {
            const info = this.adultsInfo.concat(this.childsInfo, this.babysInfo)
            this.$store.commit('setTraverInfo', info);
          } else {
            this.scrollToErrDiv(0);
          }
        })
      }
    })
  },
  watch: {
    flightInfo (val, oldVal) {
      this.$nextTick(() => {
        this.adults = val.requestFromClient.adults;
        this.childs = val.requestFromClient.childs;
        this.babys = val.requestFromClient.baby;
        this.adultsInfo = this.setTravelerInfo(this.adults, 1);
        this.childsInfo = this.setTravelerInfo(this.childs, 2);
        this.babysInfo = this.setTravelerInfo(this.babys, 3);
        const paramet = {
          departFlight: {},
          requestFromClient: {}
        };
        paramet.departFlight.stopByFlightArray = val.departFlight.stopByFlightArray;
        paramet.requestFromClient = val.requestFromClient;
        if (val.returnFlight) {
          paramet.returnFlight = {};
          paramet.returnFlight.stopByFlightArray = val.returnFlight.stopByFlightArray;
        }
        this.getPassPortFlag(paramet);
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .s-traveler-general{
    font-size: $h4;
    color: #111;
  }
  .travelers-info{
    margin-top: 10px;
  }
  .relative{
    position: relative;
  }
  // .errorText{
  //   position: absolute;
  //   right: 0.2rem;
  //   top: 0.84rem;
  //   font-size:0.22rem;
  //   color:rgba(214,13,13,1);
  // }
  .traveler-info-title{
    font-size: $h4;
    line-height: 30px;
    color: $lightBlack;
    font-weight: 700;
    margin-bottom: 5px;
  }
  .travelers-info-sex{
    line-height: 0.3rem;
    margin-bottom: 0.3rem;
  }
  .travelers-info-sex-label{
    margin-right: 0.6rem;
    font-size: $h3;
  }

  .travelers-info-name-input{
    display: block;
    width: 100%;
    height:0.9rem;
    background:rgba(250,250,250,1);
    border-radius:0.12rem;
    border:0.01rem solid rgba(220,220,220,1);
    margin: 0.2rem 0;
    padding: 0 10px;
    font-size: $h6;
    &:focus{
      border:0.01rem solid rgba(1,121,89,1);
    }
  }
  .travelers-info-date-box{
    width:100%;
    height:0.82rem;
    margin: 0.2rem 0;
    position: relative;
    background:rgba(234,234,234,1);
    border-radius:0.12rem;
    border:0.01rem solid rgba(220,220,220,1);
    line-height: 0.62rem;
    padding: 0.1rem 0rem 0.1rem 0.2rem;
  }
  .travelers-info-date-box .s-icon{
    position: absolute;
    right: 0.2rem;
    top: 0.36rem;
  }
  .travelers-info-date-input{
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
  }

        /*控制下拉小箭头的*/
  input[type="date"]::-webkit-calendar-picker-indicator {
    display: inline-block;
    width: 100%;
    height: 20px;
    /* position: absolute;
    top: 12px;
    right: 0px; */
    border: 1px solid #ccc;
    border-radius: 2px;
    box-shadow: inset 0 1px #fff, 0 1px #eee;
    background-color: red;
    color: #666;
  }
</style>
