import request from '@/utils/request'

export function getGameList(param) {

  return request({
    url: '/games/list',
    method: 'get',
    params: param
  })
}

export function getRoomList(param) {
    return request({
      url: '/games/roomlist',
      method: 'get',
      params: param
    })
  }

export function changeState(param) {
return request({
    url: '/games/changeState',
    method: 'post',
    data: param,
    headers: {
      'Content-type': 'application/x-www-form-urlencoded'
    }
})
}
