<template>
  <el-dialog
      title="新增兑换码"
      :close-on-click-modal="false"
      class="form-dialog"
      :before-close="resetForm"
      v-model:visible="isShow">
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

<script lang="ts" setup>
import codeApi from '@/api/pages/code'
import ElNotify from '@/components/el-notify'
import {ElMessageBox} from 'element-plus'
import {defineProps, ref, defineEmit} from 'vue'

let props = defineProps({
    isShow: {
      type: Boolean,
      required: true
    },
    close: {
      type: Function,
      required: true
    }
})

const emit = defineEmit(['useCopy'])

const
    loading = ref(false),
    formLabelWidth = ref('150px'),
    traffic = ref(1024),
    trafficUnit = ref('1'),
    timeUnit = ref('1'),
    timer = ref(10),
    form = ref({
      count: 10,
      usefulHours: 10,
      traffic: 1024
    }),
    rules = {
      traffic: { required: true, message: '请输入流量', trigger: 'blur' },
      usefulHours: { required: true, message: '请选中有效时间', trigger: 'change' }
    }

const addForm = ref(null)

const
    replaceData =  function () {
      switch (trafficUnit.value) {
        case '1':
          form.value.traffic = traffic.value
          break
        case '2':
          form.value.traffic = traffic.value * 1024
      }
      switch (timeUnit.value) {
        case '1':
          form.value.usefulHours = timer.value
          break
        case '2':
          form.value.usefulHours = timer.value * 24
      }
    },
    submitForm = function () {
      addForm.value.validate((valid) => {
        if (valid) {
          submitAdd()
        } else {
          return false
        }
      })
    },
    submitAdd = function () {
      this.loading = true
      replaceData()
      // this.loading = false
      console.log(this.form)
      // return true
      codeApi.add(this.form).then((res) => {
        if (res.code === 200) {
          ElNotify.success(res.message)
          ElMessageBox.confirm('是否复制新增兑换码？').then(_ => {
            emit('useCopy', res.data)
            // _this.parent.appContext.dataCopy(res.data)
          }).catch(_ => {})
          resetForm()
        } else {
          this.$notify.error(res.message)
        }
        loading.value = false
      }).catch(e => {
        loading.value = false
      })
    },
    resetForm = function () {
      if (props.close && typeof props.close === 'function') {
        props.close()
      }
      addForm.value.resetFields()
    }

</script>

<style scoped>

</style>
