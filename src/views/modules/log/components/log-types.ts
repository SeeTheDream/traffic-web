export default function typeReplace(val) {
    switch (String(val)) {
        case '1':
            return '流量同步'
        case '2':
            return '失效账号检测'
        case '3':
            return '同步session'
        case '4':
            return '管理员操作日志'
        case '5':
            return '账号查询流量记录'
        case '6':
            return '修改账号状态到被控端'
        case '7':
            return '定时同步账号'
        case '8':
            return '使用兑换码'
        case '9':
            return '系统运行日志'
        case '10':
            return 'SSH操作日志'
        default:
            return '-'
    }
}