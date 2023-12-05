import request from '@/utils/request'

export function getRoomList(param) {
    return request({
      url: '/games/jcby/roomlist',
      method: 'get',
      params: param
    })
}
export function getRoomType() {
    return request({
      url: '/games/jcby/roomType',
      method: 'get'
    })
}

export function saveGameRoom(param) {
    return request({
        url: '/games/jcby/save',
        method: 'post',
        data: param
    })
}

export function changeRoomStatus(param) {
return request({
    url: '/games/jcby/changeStatus',
    method: 'post',
    data: param,
    headers: {
      'Content-type': 'application/x-www-form-urlencoded'
    }
})
}

export function delGameRoom(param) {
    return request({
        url: '/games/jcby/delete',
        method: 'post',
        data: param,
        headers: {
          'Content-type': 'application/x-www-form-urlencoded'
        }
    })
}

export function getScenes(param) {
    return request({
      url: '/games/jcby/scences',
      method: 'get',
      params: param
    })
}