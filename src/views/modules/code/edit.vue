<template>
  <el-dialog
      @open="openForm"
      :close-on-click-modal="false"
      class="form-dialog"
      :before-close="resetForm"
      title="新增兑换码"
      :visible="isShow">
    <el-form :model="form" ref="editForm" :rules="rules" v-loading="loading">
      <el-form-item label="总流量(MB)：" prop="traffic" :label-width="formLabelWidth">
        <el-input style="width: 150px;" v-model="form.traffic"></el-input>
      </el-form-item>
      <el-form-item label="有效时间(小时)：" prop="usefulHours" :label-width="formLabelWidth">
        <el-input-number v-model="form.usefulHours" :min="1" :precision="0" :step="1"></el-input-number>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="resetForm">取 消</el-button>
      <el-button type="primary" @click="submitForm">立即生成</el-button>
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
import codeApi from '@/api/pages/code'

export default {
  name: 'EditCode',
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
  data() {
    return {
      loading: false,
      formLabelWidth: '150px',
      form: {
        id: null,
        usefulHours: null,
        traffic: null
      },
      rules: {
        traffic: { required: true, message: '请输入流量', trigger: 'blur' },
        usefulHours: { required: true, message: '请选中有效时间', trigger: 'change' }
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
      codeApi.update(this.form).then((res) => {
        if (res.code === 200) {
          vm.$notify.success(res.message)
          // vm.$confirm('是否复制新增账号？').then(_ => {
          //   vm.$parent.dataCopy(res.data)
          // }).catch(_ => {})
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
    }
  }
}
</script>

<style scoped>

</style>
