<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
    <my-element :data="data" />
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import 'my-element'

export default {
  name: 'app',
  data() {
    return {
      data: {
        a: 1,
        b: 2,
      }
    }
  },
  components: {
    HelloWorld
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
