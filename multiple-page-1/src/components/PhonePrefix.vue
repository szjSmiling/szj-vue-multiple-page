<template>
  <div class="phone__prefix">
    +{{phonePrefix}}
    <select name="phonePrefix" class="phone__prefix-select" @change="selectChange" v-model="phonePrefix">
      <option :value="code.regionCode" v-for="(code, index) in countryCodes" :key="index">
        {{code.countryName}} + ({{code.regionCode}})
      </option>
    </select>
    <i class="s-icon s-icon-datadown"></i>
  </div>
</template>
<script>
import { mobileFindSms } from '@/constants/ApiConstants';
export default {
  data () {
    return {
      countryCodes: [],
      phonePrefix: '91',
    }
  },
  methods: {
    getCountryCodes () {
      this.$http(mobileFindSms).then((res) => {
        this.countryCodes = res.list;
      });
    },
    selectChange () {
      this.$emit('getPhonePrefix', this.phonePrefix);
    }
  },
  mounted () {
    this.getCountryCodes();
    this.$emit('getPhonePrefix', '91');
  }
}
</script>
<style lang="scss">
.phone__prefix-select{
  width: 100%;
  height: 100%;
  opacity: 0;
  position: absolute;
  left: 0;
  top: 0;
}
.phone__prefix{
  position: absolute;
  left:0;
  top:0;
}
</style>
