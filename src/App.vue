<template>
  <div class="main">
    <el-config-provider :locale="zhCn" :size="elSize">
      <router-view></router-view>
    </el-config-provider>
  </div>
</template>
<script lang="ts" setup name="App">
import {onMounted, ref} from 'vue'
import {useStore} from 'vuex'
import zhCn from 'element-plus/lib/locale/lang/zh-cn'

const elSize = ref('default')

const store = useStore()

const isMobile = () => {
  // const flag = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)
  // return !!flag
  return window.innerWidth <= 800
}

const checkMobile = () => {
  let current = isMobile()
  if (current == !store.getters.isMobile) {
    store.dispatch('layout/checkMobile', current)
  }
}

onMounted(() => {
  window.addEventListener('resize', checkMobile)
})
checkMobile()
</script>

<style lang="scss">
@mixin fullHeight {
  height: 100%;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

html, body, #app {
  margin: 0;
  padding: 0;
  @include fullHeight;
}

#app {
  max-width: 100vw;
  overflow: hidden;
}
.main {
  @include fullHeight;
}

body {
  margin: 0;
}

button {
  margin-left: 10px !important;
}

.head-condition {
  text-align: left;

  & > * {
    margin: 5px !important;
    max-width: 90vw;
  }
}

.form-dialog.el-dialog {
  min-width: 750px;
}

.el-form-item__content {
  text-align: left;
  //padding-left: 5em;
}

.detail-dialog {
  .el-dialog {
    min-width: 320px;
  }
}

@media screen and (max-width: 500px) {
  .el-pagination {
    width: 85vw;
    overflow-y: hidden;
    overflow-x: auto;

    .el-pagination__rightwrapper {
      float: initial;
    }
  }
}
</style>
