import codeApi from "@/api/pages/code";
import ElNotifyApi from "@/components/el-notify";
import {ref, getCurrentInstance} from "vue";
import clipboard from 'vue-clipboard3'

export default function (data) {

    const {codeTable} = data

    const copyContent = ref(null)

    const {toClipboard} = clipboard()

    const
        copyHandler = (count) => {
            toClipboard(copyContent.value).then(function (e) {
                ElNotifyApi.success(`已复制${count}条数据。`)
                copyContent.value = ''
            }, function (e) {
                copyContent.value = ''
            })
        },
        dataCopy = (targetData) => {
            copyContent.value = ''
            if (targetData.length > 0) {
                for (const row of targetData) {
                    // eslint-disable-next-line no-irregular-whitespace
                    copyContent.value += `兑换码: ${row.code} 流量: ${row.traffic}M 有效时间: ${row.usefulHours}小时\r\n`
                }
                copyHandler(targetData.length)
            }
        },
        newCodeCopy = () => {
            codeApi.newCode().then(res => {
                dataCopy(res.data)
            }).catch(res => {
                ElNotifyApi.error(res.message)
            })
        },
        batchCopy = () => {
            const targetData = codeTable.value.selection
            copyContent.value = ''
            if (targetData.length > 0) {
                for (const row of targetData) {
                    // eslint-disable-next-line no-irregular-whitespace
                    copyContent.value += `兑换码: ${row.code} 流量: ${row.traffic}M 有效时间: ${row.usefulHours}小时\r\n`
                }
                copyHandler(targetData.length)
            }
        },
        copy = (row) => {
            // eslint-disable-next-line no-irregular-whitespace
            copyContent.value = `兑换码: ${row.code} 流量: ${row.traffic}M 有效时间: ${row.usefulHours}小时`
            copyHandler(1)
        }
    return {
        copyContent,
        newCodeCopy,
        batchCopy,
        dataCopy,
        copy,
        copyHandler,
    }
}
