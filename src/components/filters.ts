export function loadFilter(app) {
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
        },
        codeTypeReplace(val) {
            switch (String(val)) {
                case '1':
                    return '未使用'
                case '2':
                    return '已使用'
                default:
                    return '-'
            }
        }
    }
}