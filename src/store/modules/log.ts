import {Store} from 'vuex'

export default {
    namespaced: true,
    state: {
        loading: false,
        formLoading: false,
        isShow: false,
        contentShow: false,
        currentContentDate: '',
        currentContent: '',
        form: {
            timeRange: null,
            startTime: null,
            endTime: null
        },
        table: {
            list: [],
            total: null
        },
        logRange: null,
        query: {
            pageSize: 50,
            pageNumber: 1,
            type: '',
            content: '',
            startTimeStr: null,
            endTimeStr: null
        },
    },
    mutations: {
    },
    actions: {
        // @ts-ignore
        openMenu({commit}: Store<any>, data: any) {
            commit('mobileMenuOpen', data)
        },
    }
}
