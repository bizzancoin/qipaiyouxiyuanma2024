import request from '@/utils/request'

export function getRoomList(param) {
    return request({
      url: '/robot/cfg/cfgRobotRoomList',
      method: 'get',
      params: param
    })
}

export function getRoomRobotList(param) {
    return request({
      url: '/robot/cfg/list',
      method: 'get',
      params: param
    })
}

export function getNoRobotRoomList(param) {
    return request({
      url: '/robot/cfg/noCfgRobotRoomList',
      method: 'get',
      params: param
    })
}

export function getRestRobotList(param) {
    return request({
      url: '/robot/cfg/robotLeftList',
      method: 'get',
      params: param
    })
}

export function addRoomRobotCfg(param) {
    return request({
        url: '/robot/cfg/add',
        method: 'post',
        data: param
    })
}

export function modRoomRobotCfg(param) {
    return request({
        url: '/robot/cfg/modify',
        method: 'post',
        data: param,
    })
}

export function delRoomRobotCfg(param) {
    return request({
        url: '/robot/cfg/delete',
        method: 'post',
        data: param,
        headers: {
          'Content-type': 'application/x-www-form-urlencoded'
        }
    })
}

export function changeCfgStatus(param) {
    return request({
        url: '/robot/cfg/changeCfgStatus',
        method: 'post',
        data: param,
        headers: {
          'Content-type': 'application/x-www-form-urlencoded'
        }
    })
    }