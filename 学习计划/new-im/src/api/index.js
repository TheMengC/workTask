import request from './request'
import md5 from 'js-md5'
export function Login(params) {
    params.telephone = params.telephone
    params.password = md5(params.password)
    return request({
        url: '/user/login',
        method: 'post',
        params: params,
    })
}

export function GetFriendsList() {
    return request({
        url: '/base/data',
        method: 'get'
    })
}

export function Layout() {
    return request({
        url: '/user/logout',
        method: 'get'
    })
}