<template>
  <el-container class="layout__container">
    <div class="head-condition">
      <el-input
          v-model="query.name"
          clearable
          placeholder="账号"
          @change="reQueryList"
          style="width: 130px;"
          class="filter-item"
      />
      <el-select style="width: 150px" v-model="query.type" @change="reQueryList" placeholder="账号类型">
        <el-option label="全部类型" value=""></el-option>
        <el-option label="正式账号" value="1"></el-option>
        <el-option label="临时账号" value="2"></el-option>
      </el-select>
      <el-select style="width: 150px;" v-model="query.isUseful" @change="reQueryList" placeholder="请选择账号状态">
        <el-option label="全部状态" value=""></el-option>
        <el-option label="未使用" value="1"></el-option>
        <el-option label="使用中" value="2"></el-option>
        <el-option label="已失效" value="3"></el-option>
        <el-option label="禁用" value="9"></el-option>
      </el-select>
      <el-select style="width: 150px;" v-model="query.serverId" @change="reQueryList" placeholder="请选择账号状态">
        <el-option label="全部服务器" value=""></el-option>
        <el-option v-for="(item,index) in serverList" :key="index" :label="item.ip" :value="item.id"></el-option>
      </el-select>
      <el-button type="primary" @click="queryList">查询</el-button>
      <el-button type="success" @click="addFormShow = true">新增</el-button>
      <el-button type="danger" @click="batchRemove">删除</el-button>
      <el-button type="primary" @click="batchCopy">复制</el-button>
      <el-tooltip class="item" effect="dark" content="一键复制上一次新增的账号" placement="top">
        <el-button type="success" @click="newAccountCopy">一键复制最新</el-button>
      </el-tooltip>
      <el-button type="primary" @click="sync">同步流量信息</el-button>
    </div>
    <el-main>
      <el-table
          ref="accountTable"
          class="account-table"
          v-loading="loading"
          :data="tableData.accountList"
          border
          height="100%"
          tooltip-effect="dark">
        <el-table-column
            type="selection"
            align="center"
            width="45">
        </el-table-column>
        <el-table-column
            prop="name"
            label="账号"
            align="center">
        </el-table-column>
        <el-table-column
            prop="password"
            label="密码"
            align="center">
        </el-table-column>
        <el-table-column
            prop="serverIp"
            label="ip"
            width="150"
            align="center">
        </el-table-column>
        <el-table-column
            prop="port"
            label="端口"
            align="center">
        </el-table-column>
        <el-table-column
            prop="total"
            width="110"
            label="总流量(M)"
            align="center">
        </el-table-column>
        <el-table-column
            prop="used"
            width="110"
            label="已使用(M)"
            align="center">
        </el-table-column>
        <el-table-column
            prop="total"
            width="110"
            label="剩余量(M)"
            align="center">
          <template v-slot:default={row}>
            {{ (row.total - row.used).toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column
            prop="isUseful"
            label="账号状态"
            align="center">
          <template v-slot:default={row}>
            {{ $filters.accountUseful(row.isUseful) }}
          </template>
        </el-table-column>
        <el-table-column
            prop="type"
            label="账号类型"
            align="center">
          <template v-slot:default="scope">
            {{ $filters.accountType(scope.row.type) }}
          </template>
        </el-table-column>
        <el-table-column
            prop="usefulHours"
            label="账号有效期"
            width="100"
            align="center">
          <template v-slot:default="scope">
            {{ scope.row.usefulHours + '小时' }}
          </template>
        </el-table-column>
        <el-table-column
            prop="startTime"
            label="开始日期"
            align="center"
            width="160">
        </el-table-column>
        <el-table-column
            prop="endTime"
            label="结束日期"
            align="center"
            width="160">
        </el-table-column>
        <el-table-column
            prop="createTime"
            label="创建时间"
            align="center"
            width="160">
        </el-table-column>
        <el-table-column label="操作" align="center" width="320">
          <template  v-slot:default="scope">
            <el-tooltip class="item" effect="dark" content="刷新状态" placement="top">
              <el-button type="success" circle :icon="Refresh" @click="refreshState(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="可用/禁用" placement="top">
              <el-button type="warning" circle :icon="Lock" @click="toggleAccountStatus(scope.$index, scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="切换服务器" placement="top">
              <el-button type="warning" circle :icon="Cpu" @click="toggleAccountServer(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="一键复制" placement="top">
              <el-button type="success" circle :icon="DocumentCopy"
                         @click="copy(scope.$index, scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="修改数据" placement="top">
              <el-button type="primary" circle :icon="Edit"
                         @click="edit(scope.$index, scope.row)"></el-button>
            </el-tooltip>
            <el-popconfirm
                title="确定删除吗？"
                @confirm="remove(scope.$index, scope.row)"
            >
              <template v-slot:reference>
                <el-button type="danger" circle :icon="Delete"></el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer>
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
      <add-account-form :is-show="addFormShow" :close="closeAddForm" @useCopy="dataCopy"></add-account-form>
      <edit-account-form :is-show="editFormShow" :data="editData" :close="closeEditForm"></edit-account-form>
      <edit-server-form :is-show="editServerFormShow" :data="toggleServerData" :close="closeEditServerForm"></edit-server-form>
    </el-footer>
  </el-container>
</template>

<script lang="ts" name="Account" setup>
import accountApi from '@/api/pages/account'
import serverApi from '@/api/pages/server'
import addAccountForm from './add.vue'
import editAccountForm from './edit.vue'
import editServerForm from './changeServer.vue'
import {defineComponent,ref, getCurrentInstance} from 'vue'
import {ElMessage, ElMessageBox} from 'element-plus'
import ElNotify from '@/components/el-notify'
import clipboard from 'vue-clipboard3'
import {Refresh, Lock, Cpu, DocumentCopy, Edit, Delete} from '@element-plus/icons-vue'

    const
    addFormShow = ref(false),
    editFormShow = ref(false),
    editServerFormShow = ref(false),
    toggleServerData = ref({}),
    editData = ref({}),
    copyContent = ref(''),
    loading = ref(false),
    tableData = ref({
      accountList: [],
      total: 0
    }),
    query = ref({
      pageSize: 50,
      pageNumber: 1,
      serverId: '',
      name: '',
      type: '',
      isUseful: ''
    }),
    serverList = ref([]),
    // refs component
    accountTable = ref()

    const currentInstance: any = getCurrentInstance()
    const {toClipboard} = clipboard()

    const queryList = function () {
      loading.value = true
      accountApi.getAccountList(query.value).then((res) => {
        loading.value = false
        if (res.code === 200) {
          tableData.value.accountList = res.data.rows
          tableData.value.total = res.data.total
        } else {
          ElMessage({
            message: res.message,
            type: 'error',
            duration: 2000
          })
        }
      }).catch((error) => {
        ElMessage({
          message: error,
          type: 'error',
          duration: 2000
        })
        loading.value = false
      })
    },
    reQueryList = function () {
      query.value.pageNumber = 1
      queryList()
    },
    pageSizeChange = function (val: any) {
      query.value.pageSize = val
      queryList()
    },
    pageNumberChange = function (val: any) {
      query.value.pageNumber = val
      queryList()
    },
    toggleAccountServer = function (row: any) {
      toggleServerData.value = {
        id: row.id,
        serverId: row.serverId
      }
      editServerFormShow.value = true
    },
    toggleAccountStatus = function (index: number, row: any) {
      loading.value = true
      accountApi.toggleAccountStatus({
        id: row.id,
        isUseful: row.isUseful === 9 ? (row.used > 0 ? (row.used < row.total ? 2 : 3) : 1) : 9
      }).then((res) => {
        loading.value = false
        if (res.code === 200) {
          ElNotify.success('账号状态改变成功!')
          queryList()
        } else {
          ElNotify.error(res.message)
        }
        // eslint-disable-next-line handle-callback-err
      }).catch((error) => {
        loading.value = false
        ElNotify.error(error.message)
      })
    },
    refreshState = function (row :any) {
      const refreshTime: string | null = localStorage.getItem('refresh-time')
      const current = new Date().getTime()
      if ((current - Number(refreshTime)) >= 120000) {
        localStorage.setItem('refresh-time', `${new Date().getTime()}`)
        accountApi.refreshState({ name: row.name }).then((res) => {
          ElNotify.success(res.message)
          setTimeout(function () {
            window.location.reload()
          }, 500)
        }).catch((err) => {
          ElNotify.error(err.message)
        })
      } else {
        ElNotify.warning(`请${(120000 - (current - Number(refreshTime))) / 1000}秒后再使用此功能！`)
      }
    },
    edit = function (index: number, row: any) {
      editData.value = row
      editFormShow.value = true
    },
    removeHandler = function (data: any) {
      loading.value = true
      accountApi.deleteAccount(data).then(res => {
        ElNotify.success(res.message)
        loading.value = false
        queryList()
      }).catch(res => {
        ElNotify.error(res.message)
        loading.value = false
      })
    },
    remove = function (index: number, row: any) {
      const target = {
        serverId: row.serverId,
        accountId: [row.id],
        v2uiId: [row.v2uiId]
      }
      removeHandler([target])
    },
    batchRemove = function () {
      const targetData: any[] = accountTable.value.selection
      const targets: any = {}
      ElMessageBox.confirm(`确认删除${targetData.length}条数据？`)
          .then(_ => {
            if (targetData.length > 0) {
              for (let i = 0; i < targetData.length; i++) {
                const item = targetData[i]
                if (targets[item.serverId]) {
                  targets[item.serverId].accountId.push(item.id)
                  targets[item.serverId].v2uiId.push(item.v2uiId)
                } else {
                  targets[item.serverId] = {
                    serverId: item.serverId,
                    accountId: [item.id],
                    v2uiId: [item.v2uiId]
                  }
                }
              }
              const param = [...Object.values(targets)]
              removeHandler(param)
            } else {
              ElNotify.warning('未选择删除数据')
            }
          }).catch(_ => {})
    },
    copyHandler = function (count: number) {
      toClipboard(copyContent.value).then(function (e) {
        ElNotify.success(`已复制${count}条数据。`)
        copyContent.value = ''
      }, function (e) {
        copyContent.value = ''
      })
    },
    dataCopy = function (data: any) {
      copyContent.value = ''
      if (data.length > 0) {
        for (const row of data) {
          copyContent.value += `服务器:${row.serverIp})--端口:${row.port}--用户名:${row.name}--密码:${row.password}--流量使用查询：http://${location.host}/userInfo/${row.name} \r\n`
        }
        copyHandler(data.length)
      }
    },
    newAccountCopy = function () {
      accountApi.newAccount().then(res => {
        dataCopy(res.data)
      }).catch(res => {
        ElNotify.error(res.message)
      })
    },
    batchCopy = function () {
      const targetData = accountTable.value.selection
      copyContent.value = ''
      if (targetData.length > 0) {
        for (const row of targetData) {
          copyContent.value += `服务器:${row.serverIp}) 端口:${row.port} 用户名:${row.name} 密码:${row.password} 流量使用查询：http://tintin.oceless.xyz:8089/userInfo/${row.name} 总流量: ${row.total}M 有效时间: ${row.usefulHours}小时 用户类型: ${currentInstance.$filters.accountType(row.type)}\r\n`
        }
        copyHandler(targetData.length)
      }
    },
    copy = function (index: number, row: any) {
      copyContent.value = `服务器:${row.serverIp}) 端口:${row.port} 用户名: ${row.name} 密码:${row.password} 流量使用查询：http://tintin.oceless.xyz:8089/userInfo/${row.name} 总流量: ${row.total}M 有效时间: ${row.usefulHours}小时 用户类型: ${currentInstance.$filters.accountType(row.type)}\r\n`
      copyHandler(1)
    },
    sync = function () {
      accountApi.syncAccountTraffic().then((res: any) => {
        ElNotify.success(res.message)
        loading.value = false
        queryList()
      }).catch((res: any) => {
        ElNotify.error(res.message)
        loading.value = false
      })
    },
    closeAddForm = function () {
      addFormShow.value = false
      queryList()
    },
    closeEditForm = function () {
      editFormShow.value = false
      queryList()
    },
    closeEditServerForm = function () {
      editServerFormShow.value = false
      toggleServerData.value = {}
      queryList()
    }


      // created
      queryList()
      serverApi.getServerByCond({}).then(res => {
        serverList.value = res.data
      }).catch(e => {})

</script>
<style>
  .content-container {
    /*height: calc(100vh - 30px);*/
    overflow: hidden;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
</style>
<style lang="scss" scoped>
  .layout__container {
    height: 100%;
  }
  .el-select{
    margin-left: 10px;
  }
</style>
