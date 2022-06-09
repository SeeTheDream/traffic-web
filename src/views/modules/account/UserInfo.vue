<template>
  <div id='info-container'>
    <div class="main-container">
      <div class="item">
        <el-input v-model="q.account" placeholder="输入账号查询"></el-input>
        <el-button type="success" :disabled="!openQuery" :loading="!openQuery" @click="queryAccount">查询</el-button>
      </div>
      <div class="item">
        <div class="item-label">服务器</div>
        <div> {{userInfo.serverIp}}</div>
      </div>
      <div class="item">
        <div class="item-label">端口</div>
        <div> {{userInfo.port}}</div>
      </div>
      <div class="item">
        <div class="item-label">账号</div>
        <div> {{userInfo.name}}</div>
      </div>
      <div class="item">
        <div class="item-label">账号状态</div>
        <div v-bind:class="usefulText">{{$filters.accountUseful(this.userInfo.isUseful)}}
          <el-button circle @click="refreshState" title="刷新状态" icon="el-icon-refresh"></el-button>
        </div>
      </div>
      <div class="item">
        <div class="item-label">总流量(MB)</div>
        <div> {{userInfo.total}}</div>
      </div>
      <div class="item">
        <div class="item-label">已使用(MB)</div>
        <div> {{userInfo.used}}</div>
      </div>
      <div class="item">
        <div class="item-label">剩余流量(MB)</div>
        <div> {{surplus}}</div>
      </div>
  <!--      <div class="item">-->
  <!--        <div class="item-label">有效期</div>-->
  <!--        <div> {{userInfo.usefulHours}}小时</div>-->
  <!--      </div>-->
      <template v-if="userInfo.isUseful!==1">
        <div class="item">
          <div class="item-label">开始时间</div>
          <div> {{userInfo.startTime}}</div>
        </div>
        <div class="item">
          <div class="item-label">到期时间</div>
          <div> {{userInfo.endTime}}</div>
        </div>
      </template>
      <div v-if="userInfo.type===1">
          <div class="item">
            <div class="item-label" style="width:100%; text-align: center">--------流量兑换--------</div>
          </div>
          <div class="item">
            <el-input style="width: 230px" v-model="exchangeCode" placeholder="请输入兑换码"
                      autocomplete="off"></el-input>
            <el-button type="primary" style="margin-left:10px" :loading="loading" @click="exchange">兑换</el-button>
          </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import accountApi from '@/api/pages/account'
import codeApi from '@/api/pages/code'
import func from '@/utils/func'
import { defineComponent, computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import ElNotify from '@/components/el-notify'


export default defineComponent({
  // 组件名称
  name: 'UserInfo',
  setup(props) {
  	const
    q = ref({
      account: '',
    }),
    // 用户信息
    userInfo = ref({
      name: null,
      password: null,
      serverIp: null,
      port: null,
      total: null,
      used: null,
      type: null,
      isUseful: 9,
      usefulHours: null,
      startTime: null,
      endTime: null
    }),
    openQuery = ref(true),
    loading = ref(false),
    exchangeCode = ref(''),
  	surplus = computed( ctx => {
		  const used = userInfo.value.used
		  const total = userInfo.value.total
		  return used && total ? (total - used).toFixed(2) : total
    }),
    usefulText = computed(ctx => {
      return {
        useAccount: userInfo.value.isUseful === 1 || userInfo.value.isUseful === 2,
        notAccount: userInfo.value.isUseful === 3 || userInfo.value.isUseful === 9
      }
    })

    const route = useRoute()

	  const queryInfo = function(name: any) {
		  openQuery.value = false
		  setTimeout(() => {
			  openQuery.value = true
		  }, 2000)
		  accountApi.getAccountUsedInfo({
			  name: name
		  }).then((res) => {
			  if (res.data) {
				  for (const k of Object.keys(userInfo.value)) {
				  	//@ts-ignore
					  userInfo.value[k] = res.data[k]
				  }
			  } else {
				  ElNotify.error({message: '账号失效或者不存在！', duration: 1500})
			  }
		  }).catch()
	  }

    if(route.params.name){
      queryInfo(route.params.name)
    }
	  const queryHandler = function() {
		  if(!q.value.account){
			  ElNotify.error('未输入账号!')
			  return
		  }
		  queryInfo(q.value.account)
	  }
    let queryAccount = func.throttle(queryHandler.bind(this), 1000)

	  const refreshState = function () {
		  location.reload()
	  }

    const exchange = function(){
		  const exchangeParams = {
			  code: exchangeCode.value,
			  accountName: userInfo.value.name
		  }
		  loading.value = true
		  codeApi.usedCode(exchangeParams).then((res) => {
			  loading.value = false
			  if (res.code === 200) {
				  ElNotify.success(res.message)
				  setTimeout(function () {
					  location.reload()
				  }, 500)
			  } else {
				  ElNotify.error(res.message)
			  }
		  }).catch((error) => {
			  loading.value = false
			  ElNotify.error(error.message)
		  })
	  }
    return {
    	q,
      userInfo,
      openQuery,
      loading,
      exchangeCode,
      surplus,
      usefulText,
      // func
      queryAccount,
      refreshState,
      exchange,

    }
  },
  // 组件方法
  methods: {
    // refreshState () {
      // const refreshTime = localStorage.getItem('refresh-time')
      // const current = new Date().getTime()
      // if ((current - refreshTime) >= 120000) {
      //   localStorage.setItem('refresh-time', `${new Date().getTime()}`)
      //   accountApi.refreshState({ name: this.userInfo.name }).then((res) => {
      //     this.$notify.success(res.message)
      //     setTimeout(function () {
      // location.reload()
      //   }, 500)
      // }).catch((err) => {
      //   this.$notify.error(err.message)
      // })
      // } else {
      //   this.$notify.warning(`请${(120000 - (current - refreshTime)) / 1000}秒后再使用此功能！`)
      // }
    // },
  }
})
</script>

<style lang="scss">
  #info-container {
    width: 100vw;
    height: 60vh;
    min-height: 500px;
  }
  @media screen and (max-width: 479px) {
    #info-container {
      width: 100vw;
      padding: 1rem 0;
      & .main-container{
        & .item {
          margin-top: 15px;
          padding: 15px;
          font-size: 16px;
          display: flex;
          justify-content: space-between;
          border-bottom: 1px solid gainsboro;
          border-radius: 0;
        }
        & .item-label {
          font-weight: bold;
        }
        & .useAccount {
          color: #64f664;
        }
        & .notAccount {
          color: red;
        }
      }
    }
  }
  @media screen and (min-width: 480px) {
    #info-container {
      margin: 15px auto 0;
      width: 380px;
      & .main-container{
        display: flex;
        flex-flow: wrap;
        justify-content: space-between;
        & .item {
          width: 350px;
          margin-top: 15px;
          padding: 15px;
          font-size: 16px;
          border-radius: 15px;
          -webkit-box-shadow: 0 0 6px 0 #d4d4d4;
          box-shadow: 0 0 7px 0 #d4d4d4;
          border-bottom: 1px solid #e2e2e2;
          display: flex;
          justify-content: space-between;
        }
        & .item:nth-child(even) {
          background: #f1f1f1;
        }
        & .item-label {
          font-weight: bold;
        }
        & .useAccount {
          color: #64f664;
        }
        & .notAccount {
          color: red;
        }
      }
    }
  }
</style>
