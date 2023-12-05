import request from '@/utils/request'

export function getRoomList(param) {
    return request({
      url: '/games/niuniu/roomlist',
      method: 'get',
      params: param
    })
}
export function getRoomType() {
    return request({
      url: '/games/niuniu/roomType',
      method: 'get'
    })
}

export function saveGameRoom(param) {
    return request({
        url: '/games/niuniu/save',
        method: 'post',
        data: param
    })
}

export function changeRoomStatus(param) {
return request({
    url: '/games/niuniu/changeStatus',
    method: 'post',
    data: param,
    headers: {
      'Content-type': 'application/x-www-form-urlencoded'
    }
})
}

export function delGameRoom(param) {
    return request({
        url: '/games/niuniu/delete',
        method: 'post',
        data: param,
        headers: {
          'Content-type': 'application/x-www-form-urlencoded'
        }
    })
}