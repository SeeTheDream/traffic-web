import { createApp } from 'vue'
import App from './App.vue'
// @ts-ignore
import router from '@/router'
import '@/router/premission'

// @ts-ignore
import store from '@/store'

// import Element from 'element-plus'
// import 'element-plus/lib/theme-chalk/index.css'
// import 'element-plus/packages/theme-chalk/src/base.scss'
// import cn from 'element-plus/lib/locale/lang/zh-cn'


const app = createApp(App)
app.use(router)
app.use(store)
app.mount('#app')
app.config.globalProperties.$filters = {
    accountType(val: any) {
        switch (val) {
            case 1:
                return '正式账号'
            case 2:
                return '临时账号'
        }
    },
    accountUseful(val: any) {
        switch (val) {
            case 1:
                return '未使用'
            case 2:
                return '使用中'
            case 3:
                return '已失效'
            case 9:
                return '禁用'
        }
    }
}

app.config.errorHandler = (err, vm, info) => {
    // 处理错误
    console.error(err, vm, info)
    // `info` 是 Vue 特定的错误信息，比如错误所在的生命周期钩子
}
export default app

import {
    ElRow,
    ElCol,
    ElButton,
    ElSelect,
    ElOption,
    ElForm,
    ElFormItem,
    ElInput,
    ElInputNumber,
    ElDatePicker,
    ElMenu,
    ElSubmenu,
    ElMenuItem,
    ElCard,
    ElMessage,
    ElNotification,
    ElDialog,
    ElPagination,
    ElTable,
    ElTableColumn,
    ElMessageBox,
    ElLoading,
    ElTooltip,
    ElPopconfirm,
    locale
} from 'element-plus'
import 'element-plus/packages/theme-chalk/src/base.scss'
import cn from 'element-plus/lib/locale/lang/zh-cn'

const elComps = [
    ElRow,
    ElCol,
    ElButton,
    ElSelect,
    ElOption,
    ElForm,
    ElFormItem,
    ElInput,
    ElInputNumber,
    ElDatePicker,
    ElMenu,
    ElSubmenu,
    ElMenuItem,
    ElCard,
    ElMessage,
    ElNotification,
    ElDialog,
    ElPagination,
    ElTable,
    ElTableColumn,
    ElMessageBox,
    ElTooltip,
    ElPopconfirm
]
locale(cn)
elComps.forEach(comp => {
    app.use(comp)
})
// @ts-ignore
app.directive('loading', ElLoading)



