<template>
  <el-dialog
      @open="openForm"
      :close-on-click-modal="false"
      class="form-dialog"
      :before-close="resetForm"
      title="新增兑换码"
      v-model:visible="isShow">
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
import ElNotifyApi from '@/components/el-notify'
import {defineProps, ref} from 'vue'

const props = defineProps({
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
})

const
    loading = ref(false),
    formLabelWidth = ref('150px'),
    form = ref({
      id: null,
      usefulHours: null,
      traffic: null
    }),
    rules = {
      traffic: {required: true, message: '请输入流量', trigger: 'blur'},
      usefulHours: {required: true, message: '请选中有效时间', trigger: 'change'}
    },

    editForm = ref(null)

const
    resetForm = () => {
      if (props.close && typeof props.close === 'function') {
        props.close()
      }
      editForm.value.resetFields()
    },
    submitAdd = () => {
      loading.value = true
      codeApi.update(form.value).then((res) => {
        if (res.code === 200) {
          ElNotifyApi.success(res.message)
          // vm.$confirm('是否复制新增账号？').then(_ => {
          //   vm.$parent.dataCopy(res.data)
          // }).catch(_ => {})
          resetForm()
        } else {
          ElNotifyApi.error(res.message)
        }
        loading.value = false
      }).catch(e => {
        loading.value = false
      })
    },
    submitForm = () => {
      editForm.value.validate((valid) => {
        if (valid) {
          submitAdd()
        } else {
          return false
        }
      })
    },
    openForm = () => {
      for (const key in form.value) {
        form.value[key] = String(props.data[key])
      }
    }

</script>

<style scoped>

</style>
