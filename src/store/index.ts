import {createStore} from 'vuex'
import system from './modules/system'
import layout from './modules/layout'

export default createStore({
    getters: {
        isMobile: state => state.layout.isMobile,
        openMenu: (state: any) => state.layout.openMenu,
        closeMenu: (state: any) => state.layout.closeMenu,
        token: (state: any) => state.system.token,
    },
    modules: {
// @ts-ignore
        system,
// @ts-ignore
        layout
    }
})
