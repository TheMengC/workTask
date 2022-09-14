import axios from 'axios'
import { getToken, setToken } from './token'

console.log('process.env.VUE_APP_BASE_URL', process.env.VUE_APP_BASE_URL)
const service = axios.create({
    baseURL: process.env.VUE_APP_BASE_URL,
    timeout: 50000
})

service.interceptors.request.use(
    config => {
        if (getToken() && config.url !== '/user/login') {
            config.headers['access-token'] = getToken()
            config.headers['Authorization'] = getToken()
        }
        config.headers['language'] = 'zh-CN'
        config.headers['terminal'] = 3
        return config
    },
    err => {
        return Promise.reject(err)
    }
)

service.interceptors.response.use((res) => {
    if (res.data.code !== 200) {
        // alert('网络异常')
        return Promise.reject(res)
    }
    return res
}, (error) => {
    // alert('网络异常')
    return Promise.reject(error)
})

export default service