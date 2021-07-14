import {ElMessageBox} from "element-plus";
import codeApi from "@/api/pages/code";
import ElNotifyApi from "@/components/el-notify";
import {ref, Ref} from "vue";

type LinkedParent = {
    codeTable: any,
    loading: Ref<boolean>,
    queryList: any,
}

export default function (data: LinkedParent) {

    const {codeTable, loading, queryList} = data

    const
    addFormShow = ref(false),
    editFormShow = ref(false),
    editData = ref({})

    const
        edit = (row) => {
            editFormShow.value = true
            editData.value = row
        },
        remove = (row) => {
            this.removeHandler([row.id])
        },
        removeHandler = (data) => {
            loading.value = true
            codeApi.delete(data).then(res => {
                ElNotifyApi.success(res.message)
                queryList()
                loading.value = false
            }).catch(res => {
                ElNotifyApi.error(res.message)
                loading.value = false
            })
        },
        batchRemove = () => {
            const targetData = codeTable.value.selection
            ElMessageBox.confirm(`确认删除${targetData.length}条数据?`)
                .then(_ => {
                    if (targetData.length > 0) {
                        removeHandler(targetData.map(i => i.id))
                    }
                }).catch(_ => {
            })
        },
        closeAddForm = () => {
            addFormShow.value = false
            queryList()
        },
        closeEditForm = () => {
            editFormShow.value = false
            queryList()
        }
    
    return {
        addFormShow,
        editFormShow,
        editData,

        edit,
        removeHandler,
        remove,
        batchRemove,
        closeAddForm,
        closeEditForm,
    }
}
