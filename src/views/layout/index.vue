<template>
  <div class="main-view">
    <el-row :gutter="20" class="main-view-content">
      <template v-if="isMobile">
        <div v-if="openMenu" @click="changeOpen" class="mask-layer"></div>
        <div :class="[{'mobile-menu-open': openMenu},{'mobile-menu-close': closeMenu},'mobile-nav-menu-container','before-z-index']">
          <div v-if="isMobile" class="mobile-btn">
            <i v-if="!openMenu" @click="changeOpen" class="el-icon-s-unfold"></i>
            <i v-if="openMenu" @click="changeOpen" class="el-icon-s-fold"></i>
          </div>
          <left-menu/>
        </div>
      </template>
      <template v-else>
        <el-col :sm="6" :md="6" :lg="4" class="height-full">
          <left-menu/>
        </el-col>
      </template>
      <el-col class="after-z-index" :sm="18" :md="18" :lg="20">
        <router-view></router-view>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { defineComponent, computed, ref } from 'vue'
import { useStore } from 'vuex'
import { useRoute,useRouter } from 'vue-router'
import LeftMenu from './LeftMenu.vue'


export default defineComponent({
  name: 'Index',
  components: {LeftMenu},
  data () {
    return {
      isActive: true
    }
  },
  setup() {
  	const store = useStore()
    const route = useRoute()
    const router = useRouter()

    const openMenu = computed(ctx => store.getters.openMenu)
    const closeMenu = computed(ctx => store.getters.closeMenu)
    const isMobile = computed(ctx => store.getters.isMobile)

    function changeOpen() {
	    const action = store.getters.openMenu ? 'closeMenu' : 'openMenu'
	    console.log(action)
	    store.dispatch(`layout/${action}`, {}).then(() => {
	    }).catch(() => {
	    })
    }

  	return {
  		router,
  		route,

      // computed
		  openMenu,
		  closeMenu,
		  isMobile,

      // func
		  changeOpen,
    }
  }
})
</script>

<style lang="scss">
.height-full {
  height: 100%;
}
.main-view {
  padding: 15px;
  height: calc(100vh - 30px);
  .main-view-content {
    height: calc(100vh - 20px);
    position: relative;
  }
}
.mobile-btn{
  position: absolute;
  right: -28px;
  top: 100px;
  background: white;
  i{
    font-size: 30px;
  }
}
.mobile-nav-menu-container{
  position: absolute;
  width: 200px;
  padding-top: 10vh;
  margin-top: -10vh;
  left: -210px;
  height: 110vh;
  background: white;
  border-right: 1px solid #cacaca;
}
.mask-layer{
  width: 100vw;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 50;
  background: rgba(241, 241, 241, 0.5);
}
.mobile-menu-open{
  left: 0;
  animation: openAnim ease-in-out .5s;
}
.mobile-menu-close{
  left: -210px;
  animation: closeAnim ease-in-out .5s;
}
.before-z-index{
  z-index: 100;
}
.after-z-index{
  z-index: 1;
}
@keyframes openAnim {
  from{
    left: -210px;
  }
  to{
    left: 0;
  }
}
@keyframes closeAnim {
  from{
    left: 0;
  }
  to{
    left: -210px;
  }
}
@media only screen and (max-width: 768px) {
  .main-view {
    height: initial;
    .main-view-content {
      height: initial;
    }
  }
}
</style>
