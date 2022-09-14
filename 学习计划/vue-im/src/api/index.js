import axios from 'axios'
import { Dialog } from 'vant';

//axios配置
axios.defaults.timeout = 50000
axios.defaults.baseURL = 'http://101.200.224.1:8098'

//请求拦截
axios.interceptors.request.use(
  config => {
    let token = localStorage.getItem("token")
    console.log("token", token)
    if (token && token.length > 0 && config.url !== '/user/login') {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['access-token'] = token
      config.headers['Authorization'] = token
    }
    config.headers['language'] = 'zh-CN'
    config.headers['terminal'] = 3
    return config
  },
  err => {
    return Promise.reject(err)
  }
)

//判断返回状态,响应拦截
axios.interceptors.response.use((res) => {
  if (res.data.code !== 200) {
    // alert('网络异常')
    return Promise.reject(res)
  }
  return res
}, (error) => {
  // alert('网络异常')
  return Promise.reject(error)
})

export function fetchGet(url, param) {
  return new Promise((resolve, reject) => {
    axios({
      url,
      method: 'get',
      params: param,
    })
      .then(response => {
        resolve(response.data)
      }, err => {
        reject(err)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function fetchPost(url, param) {
  return new Promise((resolve, reject) => {
    axios({
      url,
      method: 'post',
      data: param,
    })
      .then(response => {
        resolve(response.data)
      }, err => {
        reject(err)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function fetchPostLogin(url, param) {
  return new Promise((resolve, reject) => {
    axios({ url, method: 'post', params: param })
      .then(response => {
        localStorage.setItem("token", response.data.token)
        resolve(response.data)
      }, err => {
        reject(err)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export default {
  //用户登录
  Login(params) {
    return fetchPostLogin('/user/login', params)
  },
  getFriendList() {
    return fetchGet("/base/data");
  },
  layout() {
    return fetchGet("/user/logout");
  },
  sendMsg(params) {
    return fetchPost('/message', params)
  }
}