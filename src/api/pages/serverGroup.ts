import request from '../config'
import {ResponseProps} from "../../utils/response-props";

export default {
  getGroupList: (params: any) => {
    return request({
      method: 'get',
      url: '/api/serverGroup',
      params
    })
  },
  getGroupListAll: (params: any) => {
    return request({
        method: 'get',
        url: '/api/serverGroup/list',
        params
      })
  },
  getGroupByServer: (params: any) => {
    return request({
      method: 'post',
      url: '/api/serverGroup/list',
      data: params
    })
  },
  deleteGroup: (params: any) => {
    return request({
      method: 'delete',
      url: '/api/serverGroup',
      data: params
    })
  },
  updateGroup: (params: any) => {
    return request({
      method: 'put',
      url: '/api/serverGroup',
      data: params
    })
  },
  add: (params: any) => {
    return request({
      method: 'post',
      url: '/api/serverGroup',
      data: params
    })
  }
}
