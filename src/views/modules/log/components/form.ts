import {ref, reactive} from 'vue'

export default function () {

    const
        form = reactive({
            timeRange: null,
            startTime: null,
            endTime: null
        }),
        rules = reactive({
            time: {
                validator: (rule, value, callback) => {
                    if (!this.form.startTime) {
                        callback(new Error('请选择时间范围'))
                    } else {
                        callback();
                    }
                },
                required: true,
                message: '请选择时间范围',
                trigger: 'change'
            }
        }),
        query = reactive({
            pageSize: 50,
            pageNumber: 1,
            type: '',
            content: '',
            startTimeStr: null,
            endTimeStr: null
        })

    return {
        form,
        rules,
        query,
    }
}
