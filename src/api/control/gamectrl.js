import request from '@/utils/request'

// 获取奖池列
export function findPrizePoolList(gameId, roomId) {
  return request({
    url: '/roomCtl/findCtlInfo',
    method: 'post',
    data: {gameId: gameId, roomId: roomId},
    headers: {
      'Content-type': 'application/x-www-form-urlencoded'
    }
  });
}

// 获取默认奖池信息
export function findDefPrizePool(gameId, roomId) {
  return request({
    url: '/roomCtl/findDefaultPrizePool',
    method: 'post',
    data: {gameId: gameId, roomId: roomId},
    headers: {
      'Content-type': 'application/x-www-form-urlencoded'
    }
  });
}

// 获取金币奖池信息
export function findGoldPrizePool(gameId, roomId, prizePoolId) {
  return request({
    url: '/roomCtl/findGoldPrizePool',
    method: 'post',
    data: {gameId: gameId, roomId: roomId, prizePoolId: prizePoolId},
    headers: {
      'Content-type': 'application/x-www-form-urlencoded'
    }
  });
}


// ---------------- 默认奖池操作 ---------------

// 添加默认奖池
export function addDefPrizePool(gameId, roomId, prizePool) {
  return request({
    url: '/roomCtl/addDefaultPrizePool',
    method: 'post',
    data: {gameId: gameId, roomId: roomId, prizePools: prizePool},
    headers: {
      'Content-type': 'application/x-www-form-urlencoded'
    }
  });
}

// 追加默认奖池金币
export function appendDefPrizePoolGold(gameId, roomId, gold) {
  return request({
    url: '/roomCtl/addDefaultPrizePoolGold',
    method: 'post',
    data: {gameId: gameId, roomId: roomId, gold: gold},
    headers: {
      'Content-type': 'application/x-www-form-urlencoded'
    }
  });
}

// 修改默认奖池金币
export function modDefPrizePoolGold(gameId, roomId, gold) {
  return request({
    url: '/roomCtl/modifyDefaultPrizePoolGold',
    method: 'post',
    data: {gameId: gameId, roomId: roomId, gold: gold},
    headers: {
      'Content-type': 'application/x-www-form-urlencoded'
    }
  });
}

// 删除默认奖池
export function delDefPrizePool(gameId, roomId) {
  return request({
    url: '/roomCtl/delDefaultPrizePool',
    method: 'post',
    data: {gameId: gameId, roomId: roomId},
    headers: {
      'Content-type': 'application/x-www-form-urlencoded'
    }
  });
}

// 添加默认奖池策略
export function addDefPrizePoolStrategy(gameId, roomId, strategy) {
  let params = {
    gameId : gameId,
    roomId : roomId,
    strategy : {
      id:strategy.id,
      control:JSON.stringify(strategy.control),
      gold:strategy.gold * 1000,
      lower:strategy.lower * 1000,
      ratio:strategy.ratio,
      time:strategy.time,
      upper:strategy.upper * 1000,
      withdrawType:strategy.withdrawType,
    }
  }
  console.log(params);
  return request({
    url: '/roomCtl/addDefaultPrizePoolStrategy',
    method: 'post',
    data: params,
    headers: {
      'Content-type': 'application/json'
    }
  });
}

// 添加默认奖池策略
export function modDefPrizePoolStrategy(gameId, roomId, strategy) {
  let params = {
    gameId : gameId,
    roomId : roomId,
    strategy : {
      id:strategy.id,
      control:JSON.stringify(strategy.control),
      gold:strategy.gold * 1000,
      lower:strategy.lower * 1000,
      ratio:strategy.ratio,
      time:strategy.time,
      upper:strategy.upper * 1000,
      withdrawType:strategy.withdrawType,
    }
  }
  console.log('modDefPrizePoolStrategy', params);
  return request({
    url: '/roomCtl/modifyDefaultPrizePoolStrategy',
    method: 'post',
    data: params,
    headers: {
      'Content-type': 'application/json'
    }
  });
}

// 删除默认奖池策略
export function delDefPrizePoolStrategy(gameId, roomId, strategyId) {
  return request({
    url: '/roomCtl/delDefaultPrizePoolStrategy',
    method: 'post',
    data: {gameId: gameId, roomId: roomId, strategyId: strategyId},
    headers: {
      'Content-type': 'application/x-www-form-urlencoded'
    }
  });
}


// ------------------ 金币奖池操作 -----------------

// 添加金币奖池
export function addGoldPrizePool(data) {
  return request({
    url: '/roomCtl/addGoldPrizePool',
    method: 'post',
    data: data,
    headers: {
      'Content-type': 'application/x-www-form-urlencoded'
    }
  });
}

// 删除金币奖池
export function delGoldPrizePool(gameId, roomId, prizePoolId) {
  return request({
    url: '/roomCtl/delGoldPrizePool',
    method: 'post',
    data: {gameId: gameId, roomId: roomId, prizePoolId: prizePoolId},
    headers: {
      'Content-type': 'application/x-www-form-urlencoded'
    }
  });
}

// 追加金币奖池金币
export function appendGoldPrizePoolGold(gameId, roomId, prizePoolId, gold) {
  return request({
    url: '/roomCtl/addGoldPrizePoolGold',
    method: 'post',
    data: {gameId: gameId, roomId: roomId, prizePoolId: prizePoolId, gold: gold},
    headers: {
      'Content-type': 'application/x-www-form-urlencoded'
    }
  });
}

// 修改金币奖池金币
export function modGoldPrizePoolGold(gameId, roomId, prizePoolId, gold) {
  return request({
    url: '/roomCtl/modifyGoldPrizePoolGold',
    method: 'post',
    data: {gameId: gameId, roomId: roomId, prizePoolId: prizePoolId, gold: gold},
    headers: {
      'Content-type': 'application/x-www-form-urlencoded'
    }
  });
}

// 修改金币奖池金币
export function modGoldPrizePoolRange(data) {
  return request({
    url: '/roomCtl/modifyGoldPrizePoolRange',
    method: 'post',
    data: data,
    headers: {
      'Content-type': 'application/x-www-form-urlencoded'
    }
  });
}

// 添加金币奖池策略
export function addGoldPrizePoolStrategy(gameId, roomId, prizePoolId, strategy) {
  let params = {
    gameId : gameId,
    roomId : roomId,
    prizePoolId : prizePoolId,
    strategy : {
      id:strategy.id,
      control:JSON.stringify(strategy.control),
      gold:strategy.gold * 1000,
      lower:strategy.lower * 1000,
      ratio:strategy.ratio,
      time:strategy.time,
      upper:strategy.upper * 1000,
      withdrawType:strategy.withdrawType,
    }
  }
  console.log(strategy.control);
  return request({
    url: '/roomCtl/addGoldPrizePoolStrategy',
    method: 'post',
    data: params,
    headers: {
      'Content-type': 'application/json'
    }
  });
}

// 修改金币奖池策略
export function modGoldPrizePoolStrategy(gameId, roomId, prizePoolId, strategy) {
  let params = {
    gameId : gameId,
    roomId : roomId,
    prizePoolId : prizePoolId,
    strategy : {
      id:strategy.id,
      control:JSON.stringify(strategy.control),
      gold:strategy.gold * 1000,
      lower:strategy.lower * 1000,
      ratio:strategy.ratio,
      time:strategy.time,
      upper:strategy.upper * 1000,
      withdrawType:strategy.withdrawType,
    }
  }
  return request({
    url: '/roomCtl/modifyGoldPrizePoolStrategy',
    method: 'post',
    data: params,
    headers: {
      'Content-type': 'application/json'
    }
  });
}

// 删除金币奖池策略
export function delGoldPrizePoolStrategy(gameId, roomId, prizePoolId, strategyId) {
  return request({
    url: '/roomCtl/delGoldPrizePoolStrategy',
    method: 'post',
    data: {gameId: gameId, roomId: roomId, prizePoolId: prizePoolId, strategyId: strategyId},
    headers: {
      'Content-type': 'application/x-www-form-urlencoded'
    }
  });
}
