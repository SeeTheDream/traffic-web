<template>
  <div class="systemLog">
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
      <el-input size="mini" style="width: 180px;" v-model="query.content" @change="getLogList" placeholder="日志内容"></el-input>
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
    <el-dialog
        title="按条件删除日志"
        :visible="isShow"
        class="form-dialog"
        :before-close="resetForm"
    >
      <el-form ref="deleteForm" :model="form" :rules="rules" v-loading="formLoading">

        <el-form-item label="账号：" prop="time" label-width="150px">
          <el-date-picker
              size="mini"
              v-model="form.timeRange"
              type="datetimerange"
              :picker-options="pickerOptions"
              @change="timeRangeChange"
              range-separator="至"
              value-format="yyyy-MM-dd HH:mm:ss"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              align="right">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm">取 消</el-button>
        <el-button type="primary" @click="submitForm">立即提交</el-button>
      </div>
    </el-dialog>
    <el-table
        v-loading="loading"
        ref="logTable"
        :data="table.list"
        border
        tooltip-effect="dark"
        :height="tableHeight"
        style="width: 100%;margin-top: 10px">
      <el-table-column
          type="selection"
          align="center"
          width="55">
      </el-table-column>
      <el-table-column
          prop="user"
          label="操作者"
          align="center">
      </el-table-column>
      <el-table-column
          prop="subtext"
          label="说明"
          align="center">
      </el-table-column>
      <el-table-column
          prop="content"
          show-overflow-tooltip
          label="操作详细内容"
          align="center">
        <template #default="scope">
          <span @click="showContent(scope.row)">{{ scope.row.content }}</span>
        </template>
      </el-table-column>
      <el-table-column
          prop="time"
          label="时间"
          align="center">
      </el-table-column>
      <el-table-column
          prop="type"
          label="类型"
          align="center">
        <template #default="scope">
          <span>{{ scope.row.type | typeReplace }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="100">
        <template slot-scope="scope">
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="remove(scope.$index, scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination class="page"
                   @size-change="pageSizeChange"
                   @current-change="pageNumberChange"
                   :current-page="query.pageNumber"
                   :page-sizes="[50, 100, 200]"
                   :page-size="query.pageSize"
                   layout="->, total, sizes, prev, pager, next, jumper"
                   :total="table.total"
                   style="height: 40px">
    </el-pagination>
    <el-dialog
        title="日志详情"
        :visible.sync="contentShow"
        class="detail-dialog"
        width="30%"
        center>
      <p>{{ currentContentDate }}</p>
      <pre>{{ currentContent }}</pre>
      <span slot="footer" class="dialog-footer">
  </span>
    </el-dialog>
  </div>
</template>

<script>
import logApi from '@/api/pages/systemLog.js'

import tableHeight from '../components/tableHeight.js'

export default {
  name: 'systemLog',
  mixins: [tableHeight],
  data() {
    return {
      loading: false,
      formLoading: false,
      isShow: false,
      contentShow: false,
      currentContentDate: '',
      currentContent: '',
      form: {
        timeRange: null,
        startTime: null,
        endTime: null
      },
      rules: {
        time: {
          validator: (rule, value, callback) => {
            if (!this.form.startTime) {
              callback(new Error('请选择时间范围'))
            } else {
              callback()
            }
          },
          required: true,
          message: '请选择时间范围',
          trigger: 'change'
        }
      },
      table: {
        list: [],
        total: null
      },
      logRange: null,
      query: {
        pageSize: 50,
        pageNumber: 1,
        type: '',
        content: '',
        startTimeStr: null,
        endTimeStr: null
      },
      pickerOptions: {
        shortcuts: [{
          text: '一周前',
          onClick(picker) {
            const start = new Date('2020-06-01')
            const end = new Date()
            end.setTime(end.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三天',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 3)
            picker.$emit('pick', [start, end])
          }
        }]
      }
    }
  },
  created () {
    this.getLogList()
  },
  filters: {
    typeReplace(val) {
      switch (String(val)) {
        case '1':
          return '流量同步'
        case '2':
          return '失效账号检测'
        case '3':
          return '同步session'
        case '4':
          return '管理员操作日志'
        case '5':
          return '账号查询流量记录'
        case '6':
          return '修改账号状态到被控端'
        case '7':
          return '定时同步账号'
        case '8':
          return '使用兑换码'
        case '9':
          return '系统运行日志'
        case '10':
          return 'SSH操作日志'
        default:
          return '-'
      }
    }
  },
  methods: {
    timeRangeChange(val) {
      this.form.startTime = val[0]
      this.form.endTime = val[1]
    },
    logRangeChange(val) {
      this.query.startTimeStr = val ? val[0] : null
      this.query.endTimeStr = val ? val[1] : null
      this.getLogList()
    },
    pageSizeChange(val) {
      this.query.pageSize = val
      this.getLogList()
    },
    pageNumberChange(val) {
      this.query.pageNumber = val
      this.getLogList()
    },
    getLogList() {
      const vm = this
      logApi.getLogList(this.query).then(res => {
        vm.table.list = res.data.rows
        vm.table.total = res.data.total
      })
    },
    remove(index, row) {
      this.removeHandler([row.id])
    },
    batchRemove() {
      const targetData = this.$refs.logTable.selection
      if (targetData.length > 0) {
        this.removeHandler(targetData.map(i => i.id))
      } else {
        this.$notify.warning('未选择待删除数据')
      }
    },
    removeHandler(data) {
      const vm = this
      vm.loading = true
      logApi.deleteLog(data).then(res => {
        vm.loading = false
        vm.$notify.success(res.message)
        vm.getLogList()
      }).catch(error => {
        vm.loading = false
        vm.$notify.error(error.message)
        vm.loading = false
      })
    },
    condRemove() {
      const vm = this
      vm.formLoading = true
      logApi.condDelete(vm.form).then(res => {
        vm.formLoading = false
        vm.$notify.success(res.message)
        vm.resetForm()
        vm.getLogList()
      }).catch(error => {
        vm.formLoading = false
        vm.$notify.error(error.message)
      })
    },
    submitForm() {
      this.$refs.deleteForm.validate((valid) => {
        if (valid) {
          this.condRemove()
        } else {
          return false
        }
      })
    },
    resetForm(done) {
      if (done && typeof done === 'function') {
        done()
      }
      this.$refs.deleteForm.resetFields()
      this.form = {
        timeRange: null,
        startTime: null,
        endTime: null
      }
      this.isShow = false
    },
    showContent(data) {
      this.contentShow = true
      this.currentContentDate = data.time
      this.currentContent = data.content
    }
  }
}
</script>

<style scoped>
  .el-select{
    margin-left: 10px;
  }
  pre{
    white-space: pre-wrap;
  }
</style>
