import request, {AxiosRequestConfig} from 'axios'
import { getToken, removeToken } from '@/utils/cookies'
import {ResponseProps} from "@/utils/response-props";

if (process.env.NODE_ENV === 'development') {
    // request.defaults.baseURL = 'http://localhost:8300'
    request.defaults.baseURL = 'http://47.115.154.30:8300'
    // request.defaults.baseURL = 'http://tintin.oceless.xyz:8300'
} else if (process.env.NODE_ENV === 'production') {
    // request.defaults.baseURL = 'http://120.24.23.46:8300'
    // request.defaults.baseURL = 'http://tintin.oceless.xyz:8300'
    request.defaults.baseURL = 'http://47.115.154.30:8300'
}

// 请求拦截器
request.interceptors.request.use(function (config) {
    // 请求之前执行
    if (getToken()) {
        config.headers.Authorization = getToken()
    }
    return config
}, function (error) {
    // 请求发生错误时执行
    return Promise.reject(error)
})

// 响应拦截器
request.interceptors.response.use(function (response) {
    // 可对响应response做一些操作
    if (response.data.code === 401) {
        removeToken()
        location.href = '/login'
    } else {
        return response.data
    }
}, function (error) {
    // 响应发生异常时触发
    return Promise.reject(error)
})

export default function (config: AxiosRequestConfig): Promise<ResponseProps> {
    return new Promise<ResponseProps>((resolve, reject) => {
        request(config).then((res: any) => {
            console.log(res)
            resolve(res)
        }).catch(() => {
            reject()
        })
    })
}
