import request from '@/utils/request'

export function loginByUsername(username, password) {
  const data = {
    username,
    password
  }
  return request({
    url: '/login',
    method: 'post',
    data,
    headers: {
      'Content-type': 'application/x-www-form-urlencoded'
    }
  })
}

export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}

export function getUserInfo() {
  return request({
    url: '/account/info',
    method: 'get'
  })
}

export function modifyPwd(param) {
  return request({
    url: '/account/changePwd',
    method: 'post',
    data: param,
    headers: {
      'Content-type': 'application/x-www-form-urlencoded'
    }
  })
}
