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
import app from '@/main'

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
