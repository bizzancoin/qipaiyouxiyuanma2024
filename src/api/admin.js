import request from '@/utils/request'

export function getList(param) {

  return request({
    url: '/admin/list',
    method: 'get',
    params: param
  })
}

export function getPermissions() {

  return request({
    url: '/admin/permissions',
    method: 'get'
  })
}

export function add(param) {
  return request({
    url: '/admin/add',
    method: 'post',
    data: param,
    headers: {
      'Content-type': 'application/x-www-form-urlencoded'
    }
  })
}

export function update(param) {
  return request({
    url: '/admin/update',
    method: 'post',
    data: param,
    headers: {
      'Content-type': 'application/x-www-form-urlencoded'
    }
  })
}

export function resetPassword(param) {
  return request({
    url: '/admin/resetPassword',
    method: 'post',
    data: param,
    headers: {
      'Content-type': 'application/x-www-form-urlencoded'
    }
  })
}


export function changeStatus(param) {
  return request({
    url: '/admin/changeStatus',
    method: 'post',
    data: param,
    headers: {
      'Content-type': 'application/x-www-form-urlencoded'
    }
  })
}

export function updatePermission(param) {
  return request({
    url: '/admin/updatePermission',
    method: 'post',
    data: param,
    headers: {
      'Content-type': 'application/x-www-form-urlencoded'
    }
  })
}

