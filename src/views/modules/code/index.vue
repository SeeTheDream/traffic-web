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
          {{ $filters.codeTypeReplace(row.isUseful) }}
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
    <add-code :is-show="addFormShow" :close="closeAddForm" @useCopy="dataCopy"></add-code>
    <edit-code :is-show="editFormShow" :data="editData" :close="closeEditForm"></edit-code>
  </div>
</template>

<script lang="ts">
import codeApi from '@/api/pages/code'
import AddCode from './add.vue'
import EditCode from './edit.vue'

import tableHeight from '@/utils/tableHeight'

import ElNotifyApi from "@/components/el-notify";
import {ref} from 'vue'
import codeCopy from './handler/code-copy'
import CodeOperation from './handler/operation'

export default {
  name: 'Code',
  mixins: [tableHeight],
  components: {AddCode, EditCode},
  setup() {
    const
        loading = ref(false),
        tableData = ref({
          list: null,
          total: null
        }),
        query = ref({
          pageSize: 50,
          pageNumber: 1,
          code: '',
          isUseful: ''
        })

    const codeTable = ref<HTMLDivElement | null>(null)

    const {copyContent, dataCopy, newCodeCopy, batchCopy, copy} = codeCopy({codeTable})

    const queryList = () => {
          loading.value = true
          codeApi.getCodeList(this.query).then((res) => {
            loading.value = false
            if (res.code === 200) {
              tableData.value.list = res.data.rows
              tableData.value.total = res.data.total
            } else {
              ElNotifyApi.default({
                message: res.message,
                type: 'error',
                duration: 2000
              })
            }
          }).catch((error) => {
            ElNotifyApi.default({
              message: error,
              type: 'error',
              duration: 2000
            })
            loading.value = false
          })
        }

    const {
      addFormShow,
      editFormShow,
      editData,

      edit,
      removeHandler,
      remove,
      batchRemove,
      closeAddForm,
      closeEditForm,
    } = CodeOperation({
      codeTable,
      loading,
      queryList,
    })

    const
        pageSizeChange = (val) => {
          query.value.pageSize = val
          queryList()
        },
        pageNumberChange = (val) => {
          query.value.pageNumber = val
          queryList()
        },
        groupChange = () => {
          queryList()
        }

    // 首次打开默认查询一次数据
    queryList()

    return {
      // ref 子组件实例
      codeTable,

      loading,
      addFormShow,
      editFormShow,
      editData,
      tableData,
      query,

      queryList,
      pageSizeChange,
      pageNumberChange,
      groupChange,

      copyContent,
      batchCopy,
      newCodeCopy,
      dataCopy,
      copy,

      edit,
      removeHandler,
      remove,
      batchRemove,
      closeAddForm,
      closeEditForm,
    }
  }
}
</script>

<style scoped>
.el-select {
  margin-left: 10px;
}
</style>
