<template>
  <div class="server">
    <div class="head-condition">
      <el-input
          v-model="query.code"
          clearable
          size="mini"
          @change="queryList"
          placeholder="兑换码"
          style="width: 200px;"
          class="filter-item"
      />
      <el-select size="mini" style="margin-left:10px" v-model="query.isUseful" @change="groupChange" placeholder="使用状态">
        <el-option label="全部" value=""></el-option>
        <el-option label="未使用" value="1"></el-option>
        <el-option label="已使用" value="2"></el-option>
      </el-select>
      <el-button size="mini" type="primary" @click="queryList">查询</el-button>
      <el-button size="mini" type="primary" @click="addFormShow = true">新增</el-button>
      <el-button size="mini" type="success" @click="batchCopy">复制</el-button>
      <el-tooltip class="item" effect="dark" content="一键复制上一次新增的兑换码" placement="top">
        <el-button size="mini" type="success" @click="newCodeCopy">一键复制最新</el-button>
      </el-tooltip>
      <el-button size="mini" type="danger" @click="batchRemove">删除</el-button>
    </div>
    <el-table
        v-loading="loading"
        :data="tableData.list"
        border
        ref="codeTable"
        tooltip-effect="dark"
        :height="tableHeight"
        style="width: 100%;margin-top: 10px">
      <el-table-column
          type="selection"
          align="center"
          width="55">
      </el-table-column>
      <el-table-column
          prop="code"
          label="兑换码"
          align="center">
      </el-table-column>
      <el-table-column
          prop="traffic"
          label="流量(MB)"
          align="center">
      </el-table-column>
      <el-table-column
          prop="usefulHours"
          label="有效时间(H)"
          align="center">
      </el-table-column>
      <el-table-column
          prop="isUseful"
          label="状态"
          align="center">
        <template v-slot={row}>
          {{ row.isUseful | typeReplace }}
        </template>
      </el-table-column>
      <el-table-column
          prop="createTime"
          label="创建时间"
          align="center">
      </el-table-column>
      <el-table-column label="操作" align="center" width="150">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="一键复制" placement="top">
            <el-button type="success" circle size="mini" icon="el-icon-copy-document"
                       @click="copy(scope.row)"></el-button>
          </el-tooltip>
          <el-button type="primary" size="mini" circle icon="el-icon-edit" @click="edit(scope.row)"></el-button>
          <el-popconfirm
              title="确定删除吗？"
              @confirm="remove(scope.row)">
            <el-button slot="reference" type="danger" circle size="mini" icon="el-icon-delete"></el-button>
          </el-popconfirm>
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
                   :total="tableData.total"
                   style="height: 40px">
    </el-pagination>
    <add-code :is-show="addFormShow" :close="closeAddForm"></add-code>
    <edit-code :is-show="editFormShow" :data="editData" :close="closeEditForm"></edit-code>
  </div>
</template>

<script>
import codeApi from '@/api/pages/code.js'
import AddCode from './add'
import EditCode from './edit'

import tableHeight from '../../components/tableHeight.js'

export default {
  name: 'Code',
  mixins: [tableHeight],
  components: { AddCode, EditCode },
  filters: {
    typeReplace(val) {
      switch (String(val)) {
        case '1':
          return '未使用'
        case '2':
          return '已使用'
        default:
          return '-'
      }
    }
  },
  data() {
    return {
      loading: false,
      addFormShow: false,
      editFormShow: false,
      editData: {},
      tableData: {
        list: null,
        total: null
      },
      copyContent: null,
      query: {
        pageSize: 50,
        pageNumber: 1,
        code: '',
        isUseful: ''
      }
    }
  },
  created () {
    this.queryList()
  },
  methods: {
    groupChange() {
      this.queryList()
    },
    queryList() {
      const vm = this
      vm.loading = true
      codeApi.getCodeList(this.query).then((res) => {
        vm.loading = false
        if (res.code === 200) {
          vm.tableData.list = res.data.rows
          vm.tableData.total = res.data.total
        } else {
          vm.$message({
            message: res.message,
            type: 'error',
            duration: 2000
          })
        }
      }).catch((error) => {
        vm.$message({
          message: error,
          type: 'error',
          duration: 2000
        })
        vm.loading = false
      })
    },
    pageSizeChange(val) {
      this.query.pageSize = val
      this.queryList()
    },
    pageNumberChange(val) {
      this.query.pageNumber = val
      this.queryList()
    },
    newCodeCopy() {
      codeApi.newCode().then(res => {
        this.dataCopy(res.data)
      }).catch(res => {
        this.$notify.error(res.message)
      })
    },
    batchCopy() {
      const targetData = this.$refs.codeTable.selection
      this.copyContent = ''
      if (targetData.length > 0) {
        for (const row of targetData) {
          // eslint-disable-next-line no-irregular-whitespace
          this.copyContent += `兑换码: ${row.code} 流量: ${row.traffic}M 有效时间: ${row.usefulHours}小时\r\n`
        }
        this.copyHandler(targetData.length)
      }
    },
    dataCopy(targetData) {
      this.copyContent = ''
      if (targetData.length > 0) {
        for (const row of targetData) {
          // eslint-disable-next-line no-irregular-whitespace
          this.copyContent += `兑换码: ${row.code} 流量: ${row.traffic}M 有效时间: ${row.usefulHours}小时\r\n`
        }
        this.copyHandler(targetData.length)
      }
    },
    copy(row) {
      // eslint-disable-next-line no-irregular-whitespace
      this.copyContent = `兑换码: ${row.code} 流量: ${row.traffic}M 有效时间: ${row.usefulHours}小时`
      this.copyHandler(1)
    },
    copyHandler(count) {
      const vm = this
      vm.$copyText(this.copyContent).then(function (e) {
        vm.$notify.success(`已复制${count}条数据。`)
        vm.copyContent = ''
      }, function (e) {
        vm.copyContent = ''
      })
    },
    edit(row) {
      this.editFormShow = true
      this.editData = row
    },
    remove(row) {
      this.removeHandler([row.id])
    },
    batchRemove() {
      const targetData = this.$refs.codeTable.selection
      this.$confirm(`确认删除${targetData.length}条数据?`)
        .then(_ => {
          if (targetData.length > 0) {
            this.removeHandler(targetData.map(i => i.id))
          }
        }).catch(_ => {})
    },
    removeHandler(data) {
      const vm = this
      vm.loading = true
      codeApi.delete(data).then(res => {
        vm.$notify.success(res.message)
        vm.queryList()
        vm.loading = false
      }).catch(res => {
        vm.$notify.error(res.message)
        vm.loading = false
      })
    },
    closeAddForm() {
      this.addFormShow = false
      this.queryList()
    },
    closeEditForm() {
      this.editFormShow = false
      this.queryList()
    }
  }
}
</script>

<style scoped>
  .el-select{
    margin-left: 10px;
  }
</style>
