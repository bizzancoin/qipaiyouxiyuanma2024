import request from '@/utils/request'

// 查找玩家
export function findUserList(args) {
  return request({
    url: '/user/list',
    method: 'get',
    params: args
  })
}

// 查找在线玩家
export function findOnlineList(args) {
  return request({
    url: '/user/onlineList',
    method: 'get',
    params: args
  });
}

export function getAnimalsRoomList(param) {
  return request({
    url: '/games/fqzs/roomlist',
    method: 'get',
    params: param
  })
}
export function getShuihuRoomList(param) {
  return request({
    url: '/games/shuihu/roomlist',
    method: 'get',
    params: param
  })
}
export function getFruitsRoomList(param) {
  return request({
    url: '/games/fruitslot/roomlist',
    method: 'get',
    params: param
  })
}

export function findGameRoom(gameId) {
  return request({
    url: '/games/simpleroomlist',
    method: 'get',
    params: {gameId: gameId}
  });
}

// 赠送身上金币
export function sendGold(playerId, gold) {
  return request({
    url: '/user/sendGold',
    method: 'post',
    data: {playerId: playerId, gold: gold},
    headers: {
      'Content-type': 'application/x-www-form-urlencoded'
    }
  });
}

// 赠送保险箱金币
export function sendSafeGold(playerId, gold) {
  return request({
    url: '/user/sendSafeGold',
    method: 'post',
    data: {playerId: playerId, gold: gold},
    headers: {
      'Content-type': 'application/x-www-form-urlencoded'
    }
  });
}
// 修改手机号
export function setPhone(playerId, phone) {
  return request({
    url: '/user/changePhone',
    method: 'post',
    data: {playerId: playerId, phone: phone},
    headers: {
      'Content-type': 'application/x-www-form-urlencoded'
    }
  });
}
// 设置靓号
export function setSuperId(playerId, superId) {
  return request({
    url: '/user/setSuperId',
    method: 'post',
    data: {playerId: playerId, superId: superId},
    headers: {
      'Content-type': 'application/x-www-form-urlencoded'
    }
  });
}
// 取消靓号
export function undoSuperId(playerId) {
  return request({
    url: '/user/undoSuperId',
    method: 'post',
    data: {playerId: playerId},
    headers: {
      'Content-type': 'application/x-www-form-urlencoded'
    }
  });
}

// 批量冻结
export function batchLock(playerIds) {
  return request({
    url: '/user/batchLock',
    method: 'post',
    data:  playerIds,
  });
}

// 激活玩家
export function batchActive(playerIds) {
  return request({
    url: '/user/batchActive',
    method: 'post',
    data:  playerIds,
  });
}

// ip转地址
export function locationDetail(param) {
  return request({
    url: '/user/ipToLocation',
    method: 'get',
    params: param,
  });
}