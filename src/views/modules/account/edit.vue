<template>
  <el-dialog
      title="修改"
      :visible="isShow"
      :model-value="isShow"
      class="form-dialog"
      @open="openForm"
      :close-on-click-modal="false"
      :before-close="resetForm"
  >
    <el-form ref="editForm" :model="form" :rules="rules" v-loading="loading">

      <el-form-item label="账号：" :label-width="formLabelWidth">
        <el-input style="width: 150px;" v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="密码：" :label-width="formLabelWidth">
        <el-input style="width: 150px;" v-model="form.password"></el-input>
      </el-form-item>
      <el-form-item label="总流量(MB)：" :label-width="formLabelWidth">
        <el-input style="width: 150px;" v-model="form.total"></el-input>
      </el-form-item>
      <el-form-item label="已用流量(MB)：" :label-width="formLabelWidth">
        <el-input style="width: 150px;" v-model="form.used"></el-input>
      </el-form-item>
      <el-form-item label="账号类型：" :label-width="formLabelWidth">
        <el-select v-model="form.type" placeholder="请选择账号类型">
          <el-option label="正式账号" value="1"></el-option>
          <el-option label="临时账号" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="账号状态：" :label-width="formLabelWidth">
        <el-select v-model="form.isUseful" placeholder="请选择账号类型">
          <el-option label="未使用" value="1"></el-option>
          <el-option label="使用中" value="2"></el-option>
          <el-option label="已失效" value="3"></el-option>
          <el-option label="禁用" value="9"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="服务器：" :label-width="formLabelWidth">
        <el-select v-model="form.serverId" placeholder="服务器">
          <el-option
              v-for="(item,index) in serverList"
              :key="index"
              :label="item.ip"
              :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="有效时间(小时)：" :label-width="formLabelWidth">
        <el-input style="width: 150px;" v-model="form.usefulHours"></el-input>
      </el-form-item>
      <el-form-item v-if="form.isUseful!='1'" label="开始时间：" :label-width="formLabelWidth">
        <el-date-picker
            v-model="form.startTime"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            placeholder="选择日期时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item v-if="form.isUseful!='1'" label="失效时间：" :label-width="formLabelWidth">
        <el-date-picker
            v-model="form.endTime"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            placeholder="选择日期时间">
        </el-date-picker>
      </el-form-item>

    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="resetForm">取 消</el-button>
      <el-button type="primary" v-loading="loading" @click="submitForm">立即提交</el-button>
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
import accountApi from '@/api/pages/account'
import serverApi from '@/api/pages/server'
import {defineProps, ref, reactive} from 'vue'
import ElNotify from '@/components/el-notify'

let props = defineProps({
  isShow: {
    type: Boolean,
    required: true
  },
  close: {
    type: Function,
    required: true
  },
  data: {
    type: Object,
    required: true
  }
})
const
    componentData = reactive({
      loading: false,
      formLabelWidth: '180px',
      serverList: [],
      form: {
        id: null,
        name: null,
        password: null,
        total: null,
        used: null,
        type: null,
        isUseful: null,
        serverId: null,
        usefulHours: null,
        startTime: null,
        endTime: null,
      },
    }),
    rules = {
      total: {required: true, message: '请输入总流量', trigger: 'blur'},
      type: {required: true, message: '请选中账号类型', trigger: 'change'},
      serverId: {required: true, message: '请选择服务器组', trigger: 'change'}
    },
    editForm = ref()

serverApi.getServerByCond({}).then(res => {
  componentData.serverList = res.data
})
const
    submitForm = () => {
      editForm.value.validate((valid: any) => {
        if (valid) {
          submitAdd()
        } else {
          return false;
        }
      });
    },
    submitAdd = () => {
      this.loading = true
      const vm = this
      accountApi.updateAccount(componentData.form).then((res) => {
        if (res.code === 200) {
          ElNotify.success(res.message)
          resetForm()
        } else {
          ElNotify.error(res.message)
        }
        componentData.loading = false
      }).catch(e => {
        componentData.loading = false
      })
    },
    resetForm = () => {
      if (props.close && typeof props.close === 'function') {
        props.close()
      }
      editForm.value.resetFields()
    },
    openForm = () => {
      for (let key in componentData.form) {
        if (key !== 'serverId') {
          //@ts-ignore
          componentData.form[key] = String(props.data[key])
        } else {
          componentData.form[key] = props.data[key]
        }
      }
    }
</script>

<style scoped>

</style>
