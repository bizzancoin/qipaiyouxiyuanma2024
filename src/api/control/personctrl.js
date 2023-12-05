import request from '@/utils/request'

// 查找玩家
export function findPlayerList(args) {
  return request({
    url: '/playerCtl/findUserCtrlListInRoom',
    method: 'post',
    data: args,
    headers: {
      'Content-type': 'application/x-www-form-urlencoded'
    }
  })
}

export function getPlayerCtrlInfo(playerId, nickName) {
  return request({
    url: '/playerCtl/findPlayerCtlInfo',
    method: 'post',
    data: {playerId: playerId, nickName: nickName},
    headers: {
      'Content-type': 'application/x-www-form-urlencoded'
    }
  })
}

export function addCtrl(data) {
  data.control = JSON.stringify(data.control);
  return request({
    url: '/playerCtl/addPlayerCtl',
    method: 'post',
    data: data,
    headers: {
      'Content-type': 'application/x-www-form-urlencoded'
    }
  })
}

export function updatePrize(data) {
  return request({
    url: '/playerCtl/updatePrizePoolGold',
    method: 'post',
    data: data,
    headers: {
      'Content-type': 'application/x-www-form-urlencoded'
    }
  })
}

export function updateCtrl(data) {
  data.control = JSON.stringify(data.control);
  return request({
    url: '/playerCtl/updateCtl',
    method: 'post',
    data: data,
    headers: {
      'Content-type': 'application/x-www-form-urlencoded'
    }
  })
}