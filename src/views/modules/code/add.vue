<template>
  <el-dialog
      title="新增兑换码"
      :close-on-click-modal="false"
      class="form-dialog"
      :before-close="resetForm"
      :visible="isShow">
    <el-form :model="form" ref="addForm" :rules="rules" v-loading="loading">
      <el-form-item label="总流量：" prop="traffic" :label-width="formLabelWidth">
        <el-input style="width: 150px;" v-model="traffic"></el-input>
        <el-select style="margin-left: 5px;width: 80px" v-model="trafficUnit" placeholder="请选择流量单位">
          <el-option label="MB" value="1"></el-option>
          <el-option label="GB" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="有效时间：" prop="usefulHours" :label-width="formLabelWidth">
        <el-input-number v-model="timer" :min="1" :precision="0" :step="1"></el-input-number>
        <el-select style="margin-left: 5px;width: 80px" v-model="timeUnit" placeholder="请选择有效时间单位">
          <el-option label="小时" value="1"></el-option>
          <el-option label="天" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="生成条数：" :label-width="formLabelWidth">
        <el-input-number v-model="form.count" :min="1" :precision="0" :step="1"></el-input-number>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="resetForm">取 消</el-button>
      <el-button type="primary" @click="submitForm">立即生成</el-button>
    </div>
  </el-dialog>
</template>

<script>
import codeApi from '@/api/pages/code'

export default {
  name: 'AddCode',
  props: {
    isShow: {
      type: Boolean,
      required: true
    },
    close: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      loading: false,
      formLabelWidth: '150px',
      traffic: 1024,
      trafficUnit: '1',
      timeUnit: '1',
      timer: 10,
      form: {
        count: 10,
        usefulHours: 10,
        traffic: 1024
      },
      rules: {
        traffic: { required: true, message: '请输入流量', trigger: 'blur' },
        usefulHours: { required: true, message: '请选中有效时间', trigger: 'change' }
      }
    }
  },
  methods: {
    replaceData () {
      switch (this.trafficUnit) {
        case '1':
          this.form.traffic = this.traffic
          break
        case '2':
          this.form.traffic = this.traffic * 1024
      }
      switch (this.timeUnit) {
        case '1':
          this.form.usefulHours = this.timer
          break
        case '2':
          this.form.usefulHours = this.timer * 24
      }
    },
    submitForm() {
      this.$refs.addForm.validate((valid) => {
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
      vm.replaceData()
      // this.loading = false
      console.log(this.form)
      // return true
      codeApi.add(this.form).then((res) => {
        if (res.code === 200) {
          vm.$notify.success(res.message)
          vm.$confirm('是否复制新增兑换码？').then(_ => {
            vm.$parent.dataCopy(res.data)
          }).catch(_ => {})
          vm.resetForm()
        } else {
          this.$notify.error(res.message)
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
      this.$refs.addForm.resetFields()
    }
  }
}
</script>

<style scoped>

</style>
