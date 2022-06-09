<template>
  <div class="main-menu">
    <el-menu
      router
      :default-active="route.path"
    >
      <el-menu-item index="/home">
        <i class="el-icon-menu"></i>
        <span slot="title">首页</span>
      </el-menu-item>
      <template v-for="(item,index) in router.options.routes">
        <el-sub-menu v-if="item.meta?.visible" :index="index+''">
          <template #title>
            <i class="el-icon-location"></i>
            <span>{{item.meta.title}}</span>
          </template>
          <template v-if="item.children?.length > 0">
            <template v-for="(routerItem, routerIdx) in item.children" :key="(routerItem?.path || routerIdx)+''">
              <el-menu-item :index="`${item.path}/${routerItem.path}`">{{routerItem.meta.title}}</el-menu-item>
            </template>
          </template>
        </el-sub-menu>
      </template>
    </el-menu>
  </div>
</template>

<script>
import { useRoute,useRouter } from 'vue-router'

export default {
  name: 'LeftMenu',
	setup() {
		const route = useRoute()
		const router = useRouter()

    return {
			router,
			route,
    }
	}
}
</script>

<style lang="scss" scoped>
</style>
