import {Store, ModuleTree, ActionTree, MutationTree, Module} from 'vuex'

const state = {
    openMenu: false,
    closeMenu: false,
    isMobile: false
}

const mutations = {
    mobileMenuOpen(state: any, data: boolean) {
        state.openMenu = true
        state.closeMenu = false
    },
    mobileMenuClose(state: any, data: boolean) {
        state.openMenu = false
        state.closeMenu = true
    },
    changeMobile(state: any, data: boolean) {
        state.isMobile = data
    }
}

const module: Module<any, any> = {
	namespaced: true,
	state: state,
	mutations: mutations,
	actions: {
// @ts-ignore
		openMenu({commit}: Store<any>, data: boolean) {
			commit('mobileMenuOpen', data)
		},
// @ts-ignore
		closeMenu({commit}: Store<any>, data: boolean) {
			commit('mobileMenuClose', data)
		},
// @ts-ignore
		checkMobile({commit}: Store<any>, data: boolean) {
			commit('changeMobile', data)
		}
	}
}

export default module
