<template>
  <div class="main">
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue'
import login from './views/login.vue'
import {useStore} from 'vuex'

export default defineComponent({
  name: 'App',
  components: {
      login
  },
  setup() {

	  const store = useStore()

	  function isMobile() {
		  // const flag = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)
		  // return !!flag
      return window.innerWidth <= 800
	  }

  	onMounted(() => {
      window.addEventListener('resize', (e) => {
      	let current = isMobile()
        if(current == !store.getters.isMobile) {
          store.dispatch('layout/checkMobile', current)
        }
      })
    })
  }
})
</script>

<style lang="scss">
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }

  html,body,#app {
    margin: 0;
    padding: 0;
  }
  body{
    margin: 0;
  }
  button{
    margin-left: 10px!important;
  }
  .head-condition{
    text-align: left;
    &>* {
      margin: 5px!important;
      max-width: 90vw;
    }
  }
  .form-dialog.el-dialog{
      min-width: 750px;
  }
  .el-form-item__content {
    text-align: left;
    //padding-left: 5em;
  }
  .detail-dialog{
    .el-dialog{
      min-width: 320px;
    }
  }
  @media screen and (max-width: 500px) {
    .el-pagination{
      width: 85vw;
      overflow-y: hidden;
      overflow-x: auto;
      .el-pagination__rightwrapper {
        float: initial;
      }
    }
  }
</style>
