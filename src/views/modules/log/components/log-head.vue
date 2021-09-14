<template>
  <div class="head-condition">
    <el-select size="mini" v-model="query.type" @change="getLogList" placeholder="日志类型">
      <el-option label="全部" value=""></el-option>
      <el-option label="流量同步" value="1"></el-option>
      <el-option label="失效账号检测" value="2"></el-option>
      <el-option label="管理员操作日志" value="4"></el-option>
      <el-option label="修改账号状态到被控端" value="6"></el-option>
      <el-option label="定时同步账号" value="7"></el-option>
      <el-option label="使用兑换码" value="8"></el-option>
      <el-option label="系统运行日志" value="9"></el-option>
      <el-option label="SSH操作日志" value="10"></el-option>
    </el-select>
    <el-input size="mini" style="width: 180px;" v-model="query.content" @change="getLogList"
              placeholder="日志内容"></el-input>
    <el-date-picker
        size="mini"
        v-model="logRange"
        type="datetimerange"
        @change="logRangeChange"
        range-separator="至"
        value-format="yyyy-MM-dd HH:mm:ss"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        align="right">
    </el-date-picker>
    <el-button size="mini" type="primary" @click="getLogList">查询</el-button>
    <el-button size="mini" type="danger" @click="batchRemove">批量删除</el-button>
    <el-button size="mini" type="danger" @click="isShow = true">指定删除</el-button>
  </div>
</template>

<script lang="ts" setup>
import logApi from "@/api/pages/systemLog";
import {reactive, defineProps, onBeforeMount} from 'vue'

const props = defineProps({

})

const table = reactive({
  list: [],
  total: null
})

// const query = reactive({
//   pageSize: 50,
//   pageNumber: 1,
//   type: '',
//   content: '',
//   startTimeStr: null,
//   endTimeStr: null
// })

const getLogList = function () {
  logApi.getLogList(query).then(res => {
    table.list = res.data.rows
    table.total = res.data.total
  })
}
getLogList()
</script>

<style scoped>

</style>
