import request from '../config'

// 120.76.141.118
export default {
  getServerList: (params: any) => {
    return request({
      method: 'get',
      url: '/api/server',
      params
    })
  },
  getServerByCond: (params: any) => {
    return request({
      method: 'get',
      url: '/api/server/list',
      params: params
    })
  },
  removeServer: (params: any) => {
    return request({
      method: 'delete',
      url: '/api/server',
      data: params
    })
  },
  add: (params: any) => {
    return request({
      method: 'post',
      url: '/api/server',
      data: params
    })
  },
  update: (params: any) => {
    return request({
      method: 'put',
      url: '/api/server',
      data: params
    })
  },
  deployEnv: (params: any) => {
    return request({
      method: 'post',
      url: '/api/server/deploy',
      data: params
    })
  },
  syncAccount: (params: any) => {
    return request({
      method: 'post',
      url: '/api/server/sync',
      data: params
    })
  }
}
