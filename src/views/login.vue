<template>
  <div :class="[{'mobile-login': isMobile},'login-wrap']" v-loading="loading">
    <img class="logo-img" :src="logo"/>
    <el-form ref="loginForm" :model="form" :rules="rules">
      <el-form-item prop="userName">
        <el-input prefix-icon="el-icon-user" placeholder="请输入用户名" v-model="form.userName"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input prefix-icon="el-icon-lock" type="password" placeholder="请输入密码" v-model="form.password"></el-input>
      </el-form-item>
    </el-form>
    <el-button class="login-button" type="primary" @click="submitForm">登录</el-button>
  </div>
</template>

<script lang="ts">
	import logoImg from '@/assets/img/logo.png'
	import api from '@/api/pages/login'
	import {setToken} from '@/utils/cookies'
	import {useStore} from 'vuex'
	import ElNotification from '@/components/el-notify'
	import {computed, defineComponent, onMounted, ref} from 'vue'
	import {useRouter} from 'vue-router'

	export default defineComponent({
		// 组件名称
		name: 'Login',
		setup() {
			// refs tag
			const loginForm = ref()

			const store = useStore()
			const router = useRouter()
			let form = ref({
				userName: '',
				password: ''
			})

			let logo = ref(logoImg)

			let loading = ref(false)

			function login() {
				if (form.value.userName === '' || form.value.password === '') {
					ElNotification.error('请输入用户名或密码')
				} else {
					loginSystem()
				}
			}

			function submitForm() {
				loginForm.value.validate((valid: any) => {
					if (valid) {
						loginSystem()
					} else {
						return false
					}
				})
			}

			function loginSystem() {
				loading.value = true
				api.login(form.value).then((res: any) => {
					loading.value = false
					if (res.code === 200) {
						// if (res.data) {
						store.dispatch('system/login', res.data).then(() => {
							setToken(res.data.token)
							router.push({path: '/home/account'})
						}).catch(() => {
							ElNotification.error(res.message)
						})
					} else {
						ElNotification.error(res.message)
					}
				}).catch((e: any) => {
					ElNotification.error(e.message)
					loading.value = false
				})
			}

			const isMobile = computed(ctx => store.state.layout.isMobile)

			onMounted(() => {
				window.addEventListener('keyup', (event) => {
					if (event.keyCode === 13) {
						// 回车执行查询
						submitForm()
					}
				})
			})

			return {
				// ref value
				form,
				loading,
				logo,
				isMobile,
				// arr,

				// ref tag (dom | children component)
				loginForm,

				rules: {
					userName: [
						{required: true, message: '请输入用户名', trigger: 'blur'}
					],
					password: [
						{required: true, message: '请输入密码', trigger: 'blur'}
					]
				},

				// func
				submitForm
			}
		}
	})
</script>

<style lang="scss">
  .login-wrap {
    width: 400px;
    margin: 100px auto auto;
    text-align: center;
  }

  h {
    font-size: 16px;
  }

  p {
    color: red;
  }

  .input-class {
    width: 200px;
    height: 40px;
    line-height: 40px;
    margin: 0 auto 10px;
    outline: none;
    border: 1px solid #888;
    padding: 10px;
    box-sizing: border-box;
  }

  .login-button {
    width: 100%;
    margin: auto !important;
  }

  .toDo {
    text-align: right;
  }

  span {
    cursor: pointer;
  }

  span:hover {
    color: #41b883;
  }

  @media screen and (max-width: 479px) {
    .mobile-login {
      margin: 50px auto;
      text-align: center;
      width: 100%;

      .logo-img {
        width: 150px;
        margin: auto;
        display: block;
      }

      .el-form {
        text-align: center;
      }

      .el-form-item {
        width: 300px;
        max-width: 90%;
        margin-right: 0;
        display: inline-block;
      }

      .login-button {
        width: 300px;
        max-width: 90%;
      }
    }
  }
</style>
