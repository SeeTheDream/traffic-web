import {Store, ModuleTree, ActionTree, MutationTree, Module} from 'vuex'

namespace Layout {
    export interface State {
        openMenu: boolean,
        closeMenu: boolean,
        isMobile: boolean,
    }

    export type Mutations = {
        mobileMenuOpen: (LayoutState, payload: boolean) => void
        mobileMenuClose: (LayoutState, payload: boolean) => void
        changeMobile: (LayoutState, payload: boolean) => void
    }

}


const state: Layout.State = {
    openMenu: false,
    closeMenu: false,
    isMobile: false
}

const mutations : MutationTree = {
    mobileMenuOpen(state: LayoutState, data: boolean) {
        state.openMenu = true
        state.closeMenu = false
    },
    mobileMenuClose(state: LayoutState, data: boolean) {
        state.openMenu = false
        state.closeMenu = true
    },
    changeMobile(state: LayoutState, data: boolean) {
        state.isMobile = data
    }
}

const module: Module<any, any> = {
	namespaced: true,
	state: state,
	mutations: mutations,
	actions: {
		openMenu({commit}: Store<any>, data: boolean) {
			commit('mobileMenuOpen', data)
            commit('')
		},
		closeMenu({commit}: Store<any>, data: boolean) {
			commit('mobileMenuClose', data)
		},
		checkMobile({commit}: Store<any>, data: boolean) {
			commit('changeMobile', data)
		}
	}
}

export default module
