import {Action, ActionTree, Module, Store} from 'vuex'

const module: Module<any, any> = {
    namespaced: true,
    state: () => ({
        token: '',
        isMobile: false,
        loginInfo: {},
        user: {}
    }),
    mutations: {
        loginHandler(state: any, data: any) {
            state.loginInfo = data
            state.token = data.token
            state.user = data.user
        }
    },
    actions: {
// @ts-ignore
        login({commit}: Store<any>, data: any) {
            commit('loginHandler', data)
        }
    }
}
export default module
