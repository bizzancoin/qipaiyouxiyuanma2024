import request from '@/utils/request'

export function getRoomList(param) {
    return request({
      url: '/games/fruitslot/roomlist',
      method: 'get',
      params: param
    })
}
export function getRoomType() {
    return request({
      url: '/games/fruitslot/roomType',
      method: 'get'
    })
}

export function saveGameRoom(param) {
    return request({
        url: '/games/fruitslot/save',
        method: 'post',
        data: param
    })
}

export function changeRoomStatus(param) {
    return request({
        url: '/games/fruitslot/changeStatus',
        method: 'post',
        data: param,
        headers: {
            'Content-type': 'application/x-www-form-urlencoded'
        }
    })
}

export function delGameRoom(param) {
    return request({
        url: '/games/fruitslot/delete',
        method: 'post',
        data: param,
        headers: {
          'Content-type': 'application/x-www-form-urlencoded'
        }
    })
}