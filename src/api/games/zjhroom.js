import request from '@/utils/request'

export function getRoomList(param) {
    return request({
      url: '/games/zjh/roomlist',
      method: 'get',
      params: param
    })
}
export function getRoomType() {
    return request({
      url: '/games/zjh/roomType',
      method: 'get'
    })
}

export function saveGameRoom(param) {
    return request({
        url: '/games/zjh/save',
        method: 'post',
        data: param
    })
}

export function changeRoomStatus(param) {
return request({
    url: '/games/zjh/changeStatus',
    method: 'post',
    data: param,
    headers: {
      'Content-type': 'application/x-www-form-urlencoded'
    }
})
}

export function delGameRoom(param) {
    return request({
        url: '/games/zjh/delete',
        method: 'post',
        data: param,
        headers: {
          'Content-type': 'application/x-www-form-urlencoded'
        }
    })
}