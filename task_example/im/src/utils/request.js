import axios from 'axios'
import { Toast, Dialog } from 'vant';
import store from '@/store'
import { getToken } from '@/utils/auth'
import qs from 'qs'
// create an axios instance
console.log('process.env.VUE_APP_BASE_URL', process.env.VUE_APP_BASE_URL)
function generateReqKey(config) {
    const { method, url, params, data } = config
    return [method, url, qs.stringify(params), qs.stringify(data)].join('&')
}
const pendingRequest = new Map()
function addPendingRequest(config) {
    const requestKey = generateReqKey(config)
    config.cancelToken =
        config.cancelToken ||
        new axios.CancelToken((cancel) => {
            if (!pendingRequest.has(requestKey)) {
                pendingRequest.set(requestKey, cancel)
            }
        })
}
function removePendingRequest(config) {
    const requestKey = generateReqKey(config)
    if (pendingRequest.has(requestKey)) {
        const cancelToken = pendingRequest.get(requestKey)
        cancelToken(requestKey)
        pendingRequest.delete(requestKey)
    }
}
const service = axios.create({
    // baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
    baseURL: process.env.VUE_APP_BASE_URL,
    // withCredentials: true, // send cookies when cross-domain requests
    timeout: 50000, // request timeout
})
// request interceptor
service.interceptors.request.use(
    (config) => {
        // do something before request is sent
        // console.log(store.getters.token);
        // removePendingRequest(config)
        // addPendingRequest(config)
        if (store.getters.token && getToken() && config.url !== '/user/login') {
            // let each request carry token
            // ['X-Token'] is a custom headers key
            // please modify it according to the actual situation
            config.headers['access-token'] = getToken()
            config.headers['Authorization'] = getToken()
        }
        config.headers['language'] = 'zh-CN'
        config.headers['terminal'] = 3
        return config
    },
    (error) => {
        // do something with request error
        console.log(error) // for debug
        return Promise.reject(error)
    },
)

// response interceptor
service.interceptors.response.use(
    /**
     * If you want to get http information such as headers or status
     * Please return  response => response
     */

    /**
     * Determine the request status by custom code
     * Here is just an example
     * You can also judge the status by HTTP Status Code
     */
    (response) => {
        console.log("success:", response);
        // removePendingRequest(response.config)
        const res = response.data
        // if the custom code is not 20000, it is judged as an error.
        return res
        if (res.code != 200) {

            return Promise.reject(response)
        } else {
            return res
        }
    },
    (error) => {
        console.log(error)
        console.log("fail", error.response) // for debug
        // removePendingRequest(error.config || {})
        if (
            error.response.status &&
            (error.response.status == 403 || error.response.status == 401)
        ) {
            // to re-login
            // ElMessageBox.confirm(
            //     '您已退出登录，可以取消以停留在此页面，或重新登录',
            //     '退出登录',
            //     {
            //         confirmButtonText: '重新登录',
            //         cancelButtonText: '取消',
            //         type: 'warning',
            //     },
            // ).then(() => {
            //     store.dispatch('user/resetToken').then(() => {
            //         location.reload()
            //     })
            // })

            const beforeClose = (action) => {
                console.log('beforeClose action', action)
                new Promise((resolve) => {
                    store.dispatch('user/resetToken').then(() => {
                        location.reload()
                    })
                });
            }


            Dialog.confirm({
                title: '退出登录',
                confirmButtonText: '重新登录',
                cancelButtonText: '取消',
                message:'您已退出登录，可以取消以停留在此页面，或重新登录',
                beforeClose,
            });


        } else {
            Toast.fail(error.message)

        }

        return Promise.reject(error)
    },
)

export default service
