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
export function loadElementUi(app) {
    elComps.forEach(comp => {
        app.use(comp)
    })
    // @ts-ignore
    app.directive('loading', ElLoading)
}
