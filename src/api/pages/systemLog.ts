import request from '../config'

export default {
  getLogList: (params: any) => {
    return request({
      method: 'get',
      url: '/api/log',
      params
    })
  },
  deleteLog: (params: any) => {
    return request({
      method: 'delete',
      url: '/api/log/batchDelete',
      data: params
    })
  },
  condDelete: (params: any) => {
    return request({
      method: 'delete',
      url: '/api/log/condDelete',
      data: params
    })
  }
}
