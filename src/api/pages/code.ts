import request from '../config'

// 120.76.141.118
export default {
  getCodeList: (params: any) => {
    return request({
      method: 'get',
      url: '/api/code',
      params
    })
  },
  add: (params: any) => {
    return request({
      method: 'post',
      url: '/api/code',
      data: params
    })
  },
  delete: (params: any) => {
    return request({
      method: 'delete',
      url: '/api/code',
      data: params
    })
  },
  update: (params: any) => {
    return request({
      method: 'put',
      url: '/api/code',
      data: params
    })
  },
  usedCode: (params: any) => {
    return request({
      method: 'post',
      url: '/api/code/useCode',
      data: params
    })
  },
  newCode: () => {
    return request({
      method: 'get',
      url: '/api/code/newCode'
    })
  }
}
