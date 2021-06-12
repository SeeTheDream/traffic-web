<template>
  <el-dialog
      @open="openForm"
      :close-on-click-modal="false"
      custom-class="form-dialog"
      :before-close="resetForm"
      title="切换服务器"
      :model-value="isShow">
    <el-form :model="form" ref="editServerForm" v-loading="loading">
      <el-form-item label="服务器：" prop="serverId" :label-width="formLabelWidth">
        <el-select style="width: 150px;" v-model="form.serverId" placeholder="请选择">
          <el-option v-for="(item,index) in serverList" :key="index" :label="item.ip" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="resetForm">取 消</el-button>
      <el-button type="primary" v-loading="loading" @click="submitAdd">确认提交</el-button>
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
import accountApi from '@/api/pages/account'
import serverApi from '@/api/pages/server'
import {defineProps, ref} from 'vue'
import ElNotify from '@/components/el-notify'

let props = defineProps({
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
    }
)
const loading = ref(false),
    formLabelWidth = ref('150px'),
    form = ref({
      id: null,
      serverId: null
    }),
    serverList = ref([]),
    editServerForm = ref()
const
    submitAdd = () => {
      loading.value = true
      accountApi.toggleServer(form.value).then((res) => {
        if (res.code === 200) {
          ElNotify.success(res.message)
          resetForm()
        } else {
          ElNotify.error(res.message)
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
      editServerForm.value.resetFields()
    }
    ,
    openForm = function () {
      for (const key in form.value) {
        //@ts-ignore
        form.value[key] = props.data[key]
      }
    }
serverApi.getServerByCond({}).then(res => {
  serverList.value = res.data
}).catch(e => {
})
</script>
