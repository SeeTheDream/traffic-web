<template>
<div class="server">
  <div class="head-condition">
    <el-input
        v-model="query.name"
        clearable
        size="mini"
        placeholder="账号"
        style="width: 200px;"
        class="filter-item"
    />
    <el-select size="mini" style="margin-left:10px" v-model="query.groupId" @change="groupChange" placeholder="账号类型">
      <el-option label="全部" value=""></el-option>
      <template v-for="(item,index) in groupList">
        <el-option :key="index"
                   :label="item.groupNum"
                   :value="item.groupNum">
        </el-option>
      </template>
    </el-select>
    <el-button size="mini" type="primary" @click="addFormShow = true">新增</el-button>
    <el-button size="mini" type="primary" @click="queryList">查询</el-button>
  </div>
  <el-table
      v-loading="loading"
      ref="serverTable"
      :data="tableData.serverList"
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
          prop="ip"
          label="IP"
          align="center">
      </el-table-column>
      <el-table-column
          prop="minPort"
          label="端口范围"
          align="center">
        <template #default="scope">
          <span>{{ scope.row.minPort + '\n - \n' + scope.row.maxPort }}</span>
        </template>
      </el-table-column>
      <el-table-column
          prop="groupNum"
          label="分组"
          align="center">
      </el-table-column>
      <el-table-column
          prop="userName"
          label="用户名"
          align="center">
      </el-table-column>
      <el-table-column
          prop="password"
          label="密码"
          align="center">
      </el-table-column>
<!--      <el-table-column-->
<!--          prop="state"-->
<!--          label="状态"-->
<!--          align="center">-->
<!--      </el-table-column>-->
      <el-table-column label="部署" align="center" width="100">
        <template slot-scope="scope">
          <el-button
              type="primary" size="mini"
              @click="deploy(scope.row)">部署
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="同步" align="center" width="100">
        <template slot-scope="scope">
          <el-button
              type="primary" size="mini"
              @click="sync(scope.row)">同步
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="150">
        <template slot-scope="scope">
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
     :current-page="tableData.pageNumber"
     :page-sizes="[50, 100, 200]"
     :page-size="tableData.pageSize"
     layout="->, total, sizes, prev, pager, next, jumper"
     :total="tableData.total"
     style="height: 40px">
  </el-pagination>
  <add-form :is-show="addFormShow" :close="closeAddForm"></add-form>
  <edit-form :is-show="editFormShow" :data="editData" :close="closeEditForm"></edit-form>
</div>
</template>

<script>
import serverApi from '@/api/pages/server.js'
import groupApi from '@/api/pages/serverGroup.js'
import AddForm from './add'
import EditForm from './edit'

import tableHeight from '../../components/tableHeight.js'

export default {
  name: 'Server',
  mixins: [tableHeight],
  components: { AddForm, EditForm },
  data() {
    return {
      loading: false,
      addFormShow: false,
      editFormShow: false,
      editData: {},
      groupList: [],
      tableData: {
        serverList: null,
        total: null
      },
      query: {
        pageSize: 50,
        pageNumber: 1,
        groupId: ''
      }
    }
  },
  created () {
    groupApi.getGroupListAll({}).then(res => {
      this.groupList = res.data
    }).catch(e => {})
    this.queryList()
  },
  methods: {
    groupChange() {
    },
    queryList() {
      const vm = this
      vm.loading = true
      serverApi.getServerList(this.query).then((res) => {
        vm.loading = false
        if (res.code === 200) {
          vm.tableData.serverList = res.data.rows
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
    edit(row) {
      this.editData = row
      this.editFormShow = true
    },
    remove(row) {
      this.removeHandler([row.id])
    },
    batchRemove() {
      const targetData = this.$refs.serverTable.selection
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
      serverApi.removeServer(data).then(res => {
        vm.$notify.success(res.message)
        vm.queryList()
        vm.loading = false
      }).catch(res => {
        vm.$notify.error(res.message)
        vm.loading = false
      })
    },
    deploy(row) {
      const deployParams = {
        id: row.id
      }
      const vm = this
      vm.loading = true
      this.$confirm('确认是否在当前服务器部署gost程序?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        serverApi.deployEnv(deployParams).then((res) => {
          if (res.code === 200) {
            vm.$notify.success(res.message)
          } else {
            vm.$notify.error(res.message)
          }
        }).catch(error => {
          console.error(error)
          vm.loading = false
        })
      }).catch(() => {
        vm.machineloading = false
        vm.disabled = false
      })
    },
    sync(row) {
      const vm = this
      vm.$confirm('确认是否在当前服务器同步用户信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        vm.loading = true
        serverApi.syncAccount({
          id: row.id
        }).then((res) => {
          vm.loading = false
          if (res.code === 200) {
            vm.$notify.success(res.message)
          } else {
            vm.$notify.error(res.message)
          }
          // eslint-disable-next-line handle-callback-err
        }).catch((error) => {
          vm.loading = false
        })
      }).catch(() => {
        vm.loading = false
      })
    },
    closeAddForm() {
      this.addFormShow = false
      this.queryList()
    },
    closeEditForm() {
      this.editFormShow = false
      this.editData = {}
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
