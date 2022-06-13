<template>
  <div class="main-view">
    <el-row class="main-view-content">
      <template v-if="isMobile">
        <div v-if="openMenu" class="mask-layer" @click="changeOpen"></div>
        <div
            :class="[{'mobile-menu-open': openMenu},{'mobile-menu-close': closeMenu},'mobile-nav-menu-container','before-z-index']">
<!--          <div class="mobile-btn">-->
<!--            <i v-if="!openMenu" class="el-icon-s-unfold" @click="changeOpen"></i>-->
<!--            <i v-if="openMenu" class="el-icon-s-fold" @click="changeOpen"></i>-->
<!--          </div>-->
          <left-menu/>
        </div>
      </template>
      <template v-else>
        <el-col :lg="4" :md="4" :sm="6" class="height-full">
          <left-menu/>
        </el-col>
      </template>
      <el-col :lg="20" :md="20" :sm="18" class="after-z-index">
        <div v-if="isMobile" class="mobile-toggle-btn" @click="changeOpen">
          <el-icon>
            <Expand v-if="!openMenu"/>
            <Fold v-else/>
          </el-icon>
        </div>
        <router-view></router-view>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts" setup>
import {computed, ref} from 'vue'
import {useStore} from 'vuex'
import {useRoute, useRouter} from 'vue-router'
import {Expand, Fold} from '@element-plus/icons-vue'
import LeftMenu from './LeftMenu.vue'

const isActive = ref<boolean>(true)
const store = useStore()
const route = useRoute()
const router = useRouter()

const openMenu = computed(ctx => store.getters.openMenu)
const closeMenu = computed(ctx => store.getters.closeMenu)
const isMobile = computed(ctx => store.getters.isMobile)

function changeOpen() {
  const action = store.getters.openMenu ? 'closeMenu' : 'openMenu'
  console.log(action)
  // store.dispatch('system/login')
  store.dispatch(`layout/${action}`, {}).then(() => {
  }).catch(() => {
  })
}

</script>

<style lang="scss">
.height-full {
  height: 100%;
}

.main-view {
  //padding: 15px;
  //height: calc(100vh - 30px);
  height: 100%;

  .main-view-content {
    height: 100%;
    //height: calc(100vh - 20px);
    position: relative;
  }
}

.mobile-btn {
  position: absolute;
  right: -28px;
  top: 100px;
  background: white;

  i {
    font-size: 30px;
  }
}

.mobile-nav-menu-container {
  position: absolute;
  width: 200px;
  padding-top: 10vh;
  margin-top: -10vh;
  left: -210px;
  height: 110vh;
  background: white;
  border-right: 1px solid #cacaca;
}

.mask-layer {
  width: 100vw;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 50;
  background: rgba(241, 241, 241, 0.5);
}

.mobile-menu-open {
  left: 0;
  animation: openAnim ease-in-out .5s;
}

.mobile-menu-close {
  left: -210px;
  animation: closeAnim ease-in-out .5s;
}

.before-z-index {
  z-index: 100;
}

.after-z-index {
  z-index: 1;
  height: 100%;
}

@keyframes openAnim {
  from {
    left: -210px;
  }
  to {
    left: 0;
  }
}

@keyframes closeAnim {
  from {
    left: 0;
  }
  to {
    left: -210px;
  }
}

//@media only screen and (max-width: 768px) {
//  .main-view {
//    height: initial;
//
//    .main-view-content {
//      height: initial;
//    }
//  }
//}

.mobile-toggle-btn {
  font-size: 32px;
  text-align: right;
  padding: 4px 1em;
}
</style>
