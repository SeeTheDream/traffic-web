import {createRouter, createWebHistory, Router, RouterOptions} from 'vue-router'
import {Plugin} from "vue";

export const routeList = [
	{
		component: () => import('@/views/login.vue'),
		path: '/login',
		name: 'login'
	}, {
		path: '/userInfo',
	}, {
		path: '/userInfo/:name',
		name: 'UserInfo',
		component: () => import('@/views/login.vue'),
	}, {
		path: '/',
		name: 'base',
		redirect: '/home/account'
	}, {
		path: '/account/query',
		name: 'QueryName',
		component: () => import('@/views/login.vue'),
	}, {
		path: '',
		redirect: '/home/account'
	}, {
		path: '/home',
		name: 'home',
		component: () => import('@/views/layout/index.vue'),
		meta: {
			title: '主控端管理',
			visible: true,
		},
		children: [
			{
				path: 'account',
				name: 'account',
				component: () => import('@/views/modules/account/index.vue'),
				meta: {
					title: '账号管理',
					visible: true
				}
			}, {
				path: 'systemLog',
				name: 'systemLog',
				component: () => import('@/views/login.vue'),
				meta: {
					title: '日志管理',
					visible: true
				}
			}, {
				path: 'code',
				name: 'code',
				component: () => import('@/views/modules/code/index.vue'),
				meta: {
					title: '兑换码',
					visible: true
				}
			}]
	}, {
		path: '/passive-ctrl',
		name: 'passive',
		component: () => import('@/views/layout/index.vue'),
		meta: {
			title: '被控端管理',
			visible: true,
		},
		children: [{
			path: 'server',
			name: 'server',
			component: () => import('@/views/login.vue'),
			meta: {
				title: '服务器管理',
				visible: true
			}
		}, {
			path: 'serverGroup',
			name: 'serverGroup',
			component: () => import('@/views/login.vue'),
			meta: {
				title: '服务器组',
				visible: true
			}
		}
		]
	},
	{
		path: '/*',
		name: '404',
		component: () => import('@/views/login.vue')
	}
]

export const reCreateRouter = () : Router => {
	return createRouter(<RouterOptions>{
		// 指定路由模式
		history: createWebHistory(),
		// 路由地址
		routes: routeList
	})
}

// @ts-ignore
const router: Plugin = reCreateRouter();

export default router
