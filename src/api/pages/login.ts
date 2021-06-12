import request from '../config'

export default {
    login: (params: any) => {
        return request({
            method: 'post',
            url: '/api/login',
            data: params
        })
    }
}
