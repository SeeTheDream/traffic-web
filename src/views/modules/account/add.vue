<template>
  <el-dialog
    title="新增"
    custom-class="form-dialog"
    :model-value="isShow"
    :close-on-click-modal="false"
    :before-close="beforeClose"
  >
    <el-form ref="addForm" :model="form" :rules="rules" v-loading="loading">
      <el-form-item label="总流量：" :label-width="formLabelWidth">
        <el-input style="width: 150px;" v-model="originTotal"></el-input>
        <el-select style="margin-left: 5px;width: 80px" v-model="trafficUnit" placeholder="请选择流量单位">
          <el-option label="MB" value="1"></el-option>
          <el-option label="GB" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="账号类型：" prop="type" :label-width="formLabelWidth">
        <el-select v-model="form.type" placeholder="请选择账号类型">
          <el-option label="正式账号" value="1"></el-option>
          <el-option label="临时账号" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="服务器组：" prop="serverGroupId" :label-width="formLabelWidth">
        <el-select v-model="form.serverGroupId">
          <el-option label="请选择" value="">请选择</el-option>
          <el-option
            v-for="(item,index) in serverGroupList"
            :key="index"
            :label="item.groupNum"
            :value="item.id">
          </el-option>
        </el-select>
        <ul class="server-ul">
          <li>{{ groupLabel(groupInfo) }}</li>
          <li v-for="(item,index) in renderServerList" :key="index">{{ item.ip }}</li>
        </ul>
      </el-form-item>
      <el-form-item label="有效时间：" :label-width="formLabelWidth">
        <el-input-number v-model="timer" :precision="0" :step="1"></el-input-number>
        <el-select style="margin-left: 5px;width: 80px" v-model="timeUnit" placeholder="请选择有效时间单位">
          <el-option label="小时" value="1"></el-option>
          <el-option label="天" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="生成条数：" :label-width="formLabelWidth">
        <el-input-number :min="1" v-model="form.count" :precision="0" :step="1"></el-input-number>
      </el-form-item>
    </el-form>
    <template v-slot:footer>
      <div class="dialog-footer">
        <el-button @click="resetForm">取 消</el-button>
        <el-button type="primary" v-loading="loading" @click="submitForm">立即创建</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts">
	import accountApi from '@/api/pages/account'
	import serverApi from '@/api/pages/server'
	import serverGroupApi from '@/api/pages/serverGroup'
	import {defineComponent, ref, watch, defineEmit} from 'vue'
	import {ElMessageBox} from 'element-plus'
	import {ResponseProps} from '@/utils/response-props'
	import ElNotify from '@/components/el-notify'


	export default defineComponent({
		name: 'AddAccount',
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
    emits: ['useCopy'],
		setup: function (props, ctx) {
			const
				loading = ref(false),
				formLabelWidth = ref('130px'),
				groupInfo = ref(''),
				renderServerList = ref([]),
				serverList = ref([]),
				serverGroupList = ref<any>([]),
				timer = ref(10),
				timeUnit = ref('1'),
				originTotal = ref(1024),
				trafficUnit = ref('1'),
				form = ref({
					total: 1024,
					type: '1',
					serverGroupId: null,
					usefulHours: 10,
					count: 10
				}),
				// $refs
				addForm = ref()

			watch(() => form.value.serverGroupId, (val) => {
				const group = serverGroupList.value.filter((i: any) => i.id === val)
				if (group.length > 0) {
					const groupNum = group[0].groupNum
					groupInfo.value = group[0]
					renderServerList.value = serverList.value
						.filter((i: any) => String(i.groupNum).split(',').includes(String(groupNum)))
				} else {
					renderServerList.value = []
					groupInfo.value = ''
				}
			})

			serverGroupApi.getGroupListAll({}).then((res: ResponseProps) => {
				serverGroupList.value = res.data
			}).catch((err: any) => console.error(err))

			serverApi.getServerByCond({}).then((res: ResponseProps) => {
				serverList.value = res.data
			})

			const groupLabel = function (val: any) {
				return val ? `${val.groupNum} - ${val.remark}` : ''
			}

			const replaceData = function () {
				switch (trafficUnit.value) {
					case '1':
						form.value.total = originTotal.value
						break
					case '2':
						form.value.total = originTotal.value * 1024
				}
				switch (timeUnit.value) {
					case '1':
						form.value.usefulHours = timer.value
						break
					case '2':
						form.value.usefulHours = timer.value * 24
				}
			}

			function submitAdd() {
				loading.value = true
				replaceData()
				accountApi.batchAdd(form.value).then((res: ResponseProps) => {
					if (res.code === 200) {
						ElNotify.success(res.message)
						localStorage.setItem('AccountNewCreateTime', res.data[0].createTime)
						ElMessageBox.confirm('是否复制新增账号？').then(_ => {
							ctx.emit('useCopy', res.data)
						}).catch(_ => {
						})
						resetForm()
					} else {
						ElNotify.error(res.message)
					}
					loading.value = false
				}).catch((e:any) => {
					console.error(e)
					loading.value = false
				})
			}

			function submitForm() {
				addForm.value.validate((valid: boolean) => {
					if (valid) {
						submitAdd()
					} else {
						return false
					}
				})
			}
      function beforeClose(done){
        resetForm()
        done()
      }
			function resetForm() {
				if (props.close && typeof props.close === 'function') {
					props.close()
				}
				addForm.value.resetFields()
			}

			return {
				loading,
				formLabelWidth,
				groupInfo,
				renderServerList,
				serverList,
				serverGroupList,
				timer,
				timeUnit,
				originTotal,
				trafficUnit,
				form,
				addForm,
				rules: {
					total: {required: true, message: '请输入总流量', trigger: 'blur'},
					type: {required: true, message: '请选中账号类型', trigger: 'change'},
					serverGroupId: {required: true, message: '请选择服务器组', trigger: 'change'}
				},

				// func
				groupLabel,
				submitForm,
        beforeClose,
        resetForm
			}
		}
	})
</script>

<style scoped>
  .server-ul {
    position: absolute;
    right: 5vw;
    top: -15vh;
    height: 15em;
    overflow: auto;
    list-style: none;
  }

  .server-ul > li {
    width: 8em;
    padding: 0 8px;
  }

  .server-ul > li:first-child {
    border-bottom: 1px solid #dadada;
  }
</style>
