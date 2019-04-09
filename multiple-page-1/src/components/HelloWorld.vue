<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <form >
      <input type="text" placeholder="name">
      <input type="text" placeholder="age">
      <p>
        <input type="text" v-validate="'required|email'"
          name="email" v-model="info.email">
        <span v-show="errors.has('email')">
          {{ errors.first('email') }}
        </span>
      </p>
      <button @click.prevent="saveData">submit</button>
    </form>
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  props: {
    msg: String
  },
  data () {
    return {
      info: {
        name: '',
        age: '',
        email: ''
      }
    }
  },
  methods: {
    saveData(){
      this.$validator.validateAll().then((result) => {
        console.log(result)
      })
    }
  }
};
</script>
<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
