<template>
  <el-dialog
      title="修改服务器信息"
      :close-on-click-modal="false"
      @open="openForm"
      class="form-dialog"
      :before-close="resetForm"
      :visible="isShow">
    <el-form :model="form" ref="editForm" :rules="rules" v-loading="loading">
      <el-form-item label="IP：" prop="ip" :label-width="formLabelWidth">
        <el-input style="width: 240px" v-model="form.ip" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="组：" prop="groupId" :label-width="formLabelWidth">
        <el-select v-model="form.groupId" multiple placeholder="请选择">
          <el-option
              v-for="(item,index) in groupList"
              :key="index"
              :label="item.groupNum"
              :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="最小端口：" prop="minPort" :label-width="formLabelWidth">
        <el-input style="width: 115px" v-model="form.minPort" autocomplete="off" placeholder=">=10000"></el-input>
      </el-form-item>
      <el-form-item label="最大端口：" prop="maxPort" :label-width="formLabelWidth">
        <el-input style="width: 115px" v-model="form.maxPort" autocomplete="off" placeholder="<=60000"></el-input>
      </el-form-item>
      <el-form-item label="用户名：" prop="userName" :label-width="formLabelWidth">
        <el-input style="width: 240px" v-model="form.userName" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="密码：" prop="password" :label-width="formLabelWidth">
        <el-input style="width: 240px" v-model="form.password" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="resetForm">取 消</el-button>
      <el-button type="primary" v-loading="loading" @click="submitForm">立即提交</el-button>
    </div>
  </el-dialog>
</template>

<script>
import serverApi from '@/api/pages/server.js'
import groupApi from '@/api/pages/serverGroup.js'

export default {
  name: 'AddServer',
  props: {
    isShow: {
      type: Boolean,
      required: true
    },
    data: {
      type: Object,
      required: true
    },
    close: {
      type: Function,
      required: true
    }
  },
  created () {
    groupApi.getGroupListAll({}).then(res => {
      this.groupList = res.data
    }).catch(e => {})
  },
  data() {
    const portValidate = (rule, value, callback) => {
      if (!value || value < 10000 || value > 60000) {
        callback(new Error('请输入正确端口范围'))
      } else {
        callback()
      }
    }
    const ipValidate = (rule, value, callback) => {
      if (!value || !/^((25[0-5]|2[0-4]\d|[01]?\d\d?)($|(?!\.$)\.)){4}$/.test(value)) {
        callback(new Error('请输入正确服务器ip'))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      formLabelWidth: '150px',
      groupList: [],
      form: {
        id: null,
        ip: null,
        groupId: [],
        minPort: 10000,
        maxPort: 60000,
        userName: 'root',
        password: 'XX123123@'
      },
      rules: {
        ip: { validator: ipValidate, required: true, trigger: 'blur' },
        groupId: { required: true, message: '请选择组', trigger: 'change' },
        minPort: { validator: portValidate, required: true, message: '请输入正确最小端口', trigger: 'blur' },
        maxPort: { validator: portValidate, required: true, message: '请输入正确最大端口', trigger: 'blur' },
        userName: { required: true, message: '请输入用户名', trigger: 'blur' },
        password: { required: true, message: '请输入登录密码', trigger: 'change' }
      }
    }
  },
  methods: {
    submitForm() {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          this.submitAdd()
        } else {
          return false
        }
      })
    },
    submitAdd() {
      this.loading = true
      const vm = this
      this.loading = false
      const param = {
        ...this.form
      }
      param.groupId = this.form.groupId.join()
      // console.log(param)
      // return true
      serverApi.update(param).then((res) => {
        if (res.code === 200) {
          vm.$notify.success(res.message)
          vm.resetForm()
        } else {
          vm.$notify.error(res.message)
        }
        vm.loading = false
      }).catch(e => {
        vm.loading = false
      })
    },
    resetForm () {
      if (this.close && typeof this.close === 'function') {
        this.close()
      }
      this.$refs.editForm.resetFields()
    },
    openForm() {
      for (const key in this.form) {
        this.form[key] = String(this.data[key])
      }
      groupApi.getGroupByServer({ id: this.form.id }).then(res => {
        if (res.data) {
          this.form.groupId = res.data.map(i => i.id)
        }
      }).catch(err => {
        this.$notify.error(err.message)
      })
    }
  }
}
</script>

<style scoped>

</style>
