<template>
  <div>
    <SearchCity v-if="showCity"/>
    <SearchForm />
    <div class="s-icon s-icon-down"></div>
  </div>
</template>
<script>
import SearchForm from './SearchForm';
import EvnetHub from '@/utils/EventHub';
// SearchCity: () => import('@/components/SearchCity')
export default {
  name: 'Home',
  components: {
    SearchForm,
    SearchCity: () => import('@/components/SearchCity')
  },
  data () {
    return {
      showCity: false
    };
  },
  methods: {
    openCity () {
      this.showCity = true;
    },
    closeCity () {
      this.showCity = false;
    }
  },
  created () {
    EvnetHub.$on('openCity', this.openCity);
    EvnetHub.$on('closeCity', this.closeCity);
  }
};
</script>
