<template>
  <div class="server-group">
    <div class="head-condition">
      <el-button size="mini" type="primary" @click="queryList">查询</el-button>
      <el-button size="mini" type="success" @click="addFormShow = true">新增</el-button>
      <el-button size="mini" type="danger" @click="batchRemove">删除</el-button>
    </div>
    <el-table
        ref="groupTable"
        v-loading="loading"
        :data="tableData.list"
        border
        :height="tableHeight"
        tooltip-effect="dark"
        style="width: 100%;margin-top: 10px">
      <el-table-column
          type="selection"
          align="center"
          width="45">
      </el-table-column>
      <el-table-column
          prop="groupNum"
          label="名称"
          align="center">
      </el-table-column>
      <el-table-column
          prop="remark"
          label="备注"
          align="center">
      </el-table-column>
      <el-table-column label="操作" align="center" width="270">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="修改数据" placement="top">
            <el-button type="primary" circle size="mini" icon="el-icon-edit"
                       @click="edit(scope.row)"></el-button>
          </el-tooltip>
          <el-popconfirm
              title="确定删除吗？"
              @confirm="remove(scope.row)"
          >
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
    <el-dialog
        title="新增"
        :visible="addFormShow"
        class="form-dialog"
        :close-on-click-modal="false"
        :before-close="resetForm"
    >
      <el-form ref="addForm" :model="form" :rules="rules" v-loading="addFormLoading">
        <el-form-item label="分组名称：" prop="groupNum" :label-width="formLabelWidth">
          <el-input style="width: 150px;" v-model="form.groupNum"></el-input>
        </el-form-item>
        <el-form-item label="备注：" :label-width="formLabelWidth">
          <el-input style="width: 150px;" type="textarea" v-model="form.remark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm">取 消</el-button>
        <el-button type="primary" @click="submitAddForm">立即创建</el-button>
      </div>
    </el-dialog>
    <el-dialog
        title="修改"
        :visible="editFormShow"
        class="form-dialog"
        :close-on-click-modal="false"
        :before-close="resetEditForm"
    >
      <el-form ref="editForm" :model="editForm" :rules="editRules" v-loading="editFormLoading">
        <el-form-item label="分组名称：" prop="groupNum" :label-width="formLabelWidth">
          <el-input style="width: 150px;" v-model="editForm.groupNum"></el-input>
        </el-form-item>
        <el-form-item label="备注：" :label-width="formLabelWidth">
          <el-input style="width: 150px;" type="textarea" v-model="editForm.remark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetEditForm">取 消</el-button>
        <el-button type="primary" @click="submitEditForm">立即提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import groupApi from '@/api/pages/serverGroup.js'

import tableHeight from '../../components/tableHeight.js'

export default {
  name: 'ServerGroup',
  mixins: [tableHeight],
  data() {
    return {
      formLabelWidth: '150px',
      loading: false,
      addFormLoading: false,
      editFormLoading: false,
      addFormShow: false,
      editFormShow: false,
      groupList: [],
      tableData: {
        list: [],
        total: null
      },
      form: {
        groupNum: null,
        remark: null
      },
      editForm: {
        id: null,
        groupNum: null,
        remark: null
      },
      query: {
        pageSize: 20,
        pageNumber: 1
      },
      rules: {
        groupNum: { required: true, message: '请输入分组名称', trigger: 'blur' }
      },
      editRules: {
        groupNum: { required: true, message: '请输入分组名称', trigger: 'blur' }
      }
    }
  },
  created () {
    this.queryList()
  },
  methods: {
    queryList() {
      const vm = this
      vm.loading = true
      groupApi.getGroupList(this.query).then((res) => {
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
    edit(data) {
      this.editFormShow = true
      this.editForm.id = data.id
      this.editForm.groupNum = data.groupNum
      this.editForm.remark = data.remark
    },
    remove(data) {
      this.removeHandler([data.id])
    },
    batchRemove() {
      const targetData = this.$refs.groupTable.selection
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
      groupApi.deleteGroup(data).then(res => {
        vm.$notify.success(res.message)
        vm.queryList()
        vm.loading = false
      }).catch(res => {
        vm.$notify.error(res.message)
        vm.loading = false
      })
    },
    submitAddForm() {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          this.addHandler()
        } else {
          return false
        }
      })
    },
    addHandler() {
      this.addFormLoading = true
      const vm = this
      groupApi.add(this.form).then((res) => {
        if (res.code === 200) {
          vm.$notify.success(res.message)
          this.resetForm()
          this.queryList()
        } else {
          vm.$notify.error(res.message)
        }
        vm.addFormLoading = false
      }).catch(e => {
        vm.addFormLoading = false
      })
    },
    submitEditForm() {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          this.editHandler()
        } else {
          return false
        }
      })
    },
    editHandler() {
      this.editFormLoading = true
      const vm = this
      groupApi.updateGroup(this.editForm).then((res) => {
        if (res.code === 200) {
          vm.$notify.success(res.message)
          this.resetEditForm()
          this.queryList()
        } else {
          vm.$notify.error(res.message)
        }
        vm.editFormLoading = false
      }).catch(e => {
        vm.editFormLoading = false
      })
    },
    resetForm(done) {
      if (done && typeof done === 'function') {
        done()
      } else {
        this.addFormShow = false
      }
      this.form = {
        groupNum: null,
        remark: null
      }
    },
    resetEditForm(done) {
      if (done && typeof done === 'function') {
        done()
      } else {
        this.editFormShow = false
      }
      this.editForm = {
        id: null,
        groupNum: null,
        remark: null
      }
    }
  }
}
</script>

<style scoped>
  .el-select{
    margin-left: 10px;
  }
</style>
