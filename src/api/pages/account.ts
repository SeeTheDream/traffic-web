import request from '../config'

export default {
  getAccountList: (params: any) => {
    return request({
      method: 'get',
      url: '/api/account',
      params
    })
  },
  deleteAccount: (params: any) => {
    return request({
      method: 'delete',
      url: '/api/account',
      data: params
    })
  },
  updateAccount: (params: any) => {
    return request({
      method: 'put',
      url: '/api/account',
      data: params
    })
  },
  batchAdd: (params: any) => {
    return request({
      method: 'post',
      url: '/api/account',
      data: params
    })
  },
  syncAccountTraffic: () => {
    return request.get('/api/account/syncTraffic')
  },
  toggleAccountStatus: (params: any) => {
    return request({
      method: 'post',
      url: '/api/account/toggleState',
      data: params
    })
  },
  toggleServer: (params: any) => {
    return request({
      method: 'put',
      url: '/api/account/toggleServer',
      data: params
    })
  },
  getAccountUsedInfo: (params: any) => {
    return request({
      method: 'get',
      url: '/api/account/single',
      params
    })
  },
  refreshState: (params: any) => {
    return request({
      method: 'post',
      url: '/api/account/refreshState',
      data: params
    })
  },
  newAccount: () => {
    return request({
      method: 'get',
      url: '/api/account/newAccount'
    })
  }
}
