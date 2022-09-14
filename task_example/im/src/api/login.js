import request from '@/utils/request'
import md5 from 'js-md5'
export function login(params) {
  // params = {
  //   password: "670b14728ad9902aecba32e22fa4f6bd",
  //   telephone: "13500000175"
  // };
  // params.telephone = '+86' + params.telephone
  params.telephone = params.telephone
  params.password = md5(params.password)
  return request({
    url: '/user/login',
    method: 'post',
    params: params,
  })
}
export function logout() {
  return request({
    url: '/user/logout',
    method: 'get',
  })
}
export function getInfo() {
  return request({
    url: '/base/data',
    method: 'get',
  })
}
export function getUserInfo(id) {
  return request({
    url: `/user/${id}`,
    method: 'get',
  })
}
//注册接口
export function fetchRegister(data) {
  data = JSON.parse(JSON.stringify(data))
  data.password = md5(data.password)
  // data.telephone = '+86' + data.telephone
  data.telephone = data.telephone
  return request({
    url: '/user/register',
    method: 'post',
    data,
  })
}
//上传注册接口
export function uploadFile(token, bucket, key, data) {
  return request({
    url: `/file/${bucket}/${key}`,
    method: 'post',
    headers: {
      'access-token': token,
    },
    data,
  })
}
//注册验证码
export function getCode(telephone) {
  return request({
    url: `/code/register/${telephone}`,
    method: 'get',
  })
}
