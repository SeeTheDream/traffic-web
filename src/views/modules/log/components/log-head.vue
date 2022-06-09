<template>
  <div class="head-condition">
    <el-select v-model="query.type" placeholder="日志类型" @change="getLogList">
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
    <el-input v-model="query.content" placeholder="日志内容" style="width: 180px;"
              @change="getLogList"></el-input>
    <el-date-picker
        v-model="logRange"
        align="right"
        end-placeholder="结束日期"
        range-separator="至"
        start-placeholder="开始日期"
        type="datetimerange"
        value-format="yyyy-MM-dd HH:mm:ss"
        @change="logRangeChange">
    </el-date-picker>
    <el-button type="primary" @click="getLogList">查询</el-button>
    <el-button type="danger" @click="batchRemove">批量删除</el-button>
    <el-button type="danger" @click="isShow = true">指定删除</el-button>
  </div>
</template>

<script lang="ts" setup>
import logApi from "@/api/pages/systemLog";
import {defineProps, reactive} from 'vue'

const props = defineProps({})

const table = reactive({
  list: [],
  total: null
})

const query = reactive({
  pageSize: 50,
  pageNumber: 1,
  type: '',
  content: '',
  startTimeStr: null,
  endTimeStr: null
})

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
