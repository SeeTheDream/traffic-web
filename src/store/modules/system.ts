import {Store} from 'vuex'


export default {
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
