import {Store} from 'vuex'

export default {
	namespaced: true,
	state: {
		openMenu: false,
		closeMenu: false,
		isMobile: false
	},
	mutations: {
		mobileMenuOpen(state: any, data: any) {
			state.openMenu = true
			state.closeMenu = false
		},
		mobileMenuClose(state: any, data: any) {
			state.openMenu = false
			state.closeMenu = true
		},
		changeMobile(state: any, data: any) {
			state.isMobile = data
		}
	},
	actions: {
        // @ts-ignore
		openMenu({commit}: Store<any>, data: any) {
			commit('mobileMenuOpen', data)
		},
        // @ts-ignore
		closeMenu({commit}: Store<any>, data: any) {
			commit('mobileMenuClose', data)
		},
        // @ts-ignore
		checkMobile({commit}: Store<any>, data: any) {
			commit('changeMobile' +
                '' +
                '' +
                '', data)
		}
	}
}
