export default function () {

    return {
        pickerOptions: {
            shortcuts: [{
                text: '一周前',
                onClick(picker) {
                    const start = new Date('2020-06-01')
                    const end = new Date()
                    end.setTime(end.getTime() - 3600 * 1000 * 24 * 7)
                    picker.$emit('pick', [start, end])
                }
            }, {
                text: '最近一周',
                onClick(picker) {
                    const end = new Date()
                    const start = new Date()
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
                    picker.$emit('pick', [start, end])
                }
            }, {
                text: '最近三天',
                onClick(picker) {
                    const end = new Date()
                    const start = new Date()
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 3)
                    picker.$emit('pick', [start, end])
                }
            }]
        }
    }

}