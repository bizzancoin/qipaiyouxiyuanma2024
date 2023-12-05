import request from '@/utils/request'

//赠送金币列表
export function findGiftList(args) {
  return request({
    url: '/gold/sendlist',
    method: 'get',
    params: args
  })
}

//用户转账金币列表
export function findUserTransList(args) {
  return request({
    url: '/bank/transferList',
    method: 'get',
    params: args
  })
}

//用户金币流水
export function findUserGoldLog(args) {
  return request({
    url: '/gold/goldList',
    method: 'get',
    params: args
  })
}
// 用户安全金币流水
export function findUserSafeGoldLog(args) {
  return request({
    url: '/gold/safeGoldList',
    method: 'get',
    params: args
  })
}

// 用户游戏金币流水
export function findUserGameGoldLog(args) {
  return request({
    url: '/gold/gameGoldList',
    method: 'get',
    params: args
  })
}

export function findUserTransferMoneyLog(args) {
  return request({
    url: '/gold/transferMoneyGoldList',
    method: 'get',
    params: args
  })
}

export function findDailyList(args) {
  return request({
    url: '/gold/dailyList',
    method: 'get',
    params: args
  })
}

export function findRechargeLog(args) {
  return request({
    url: '/recharge/list',
    method: 'get',
    params: args
  })
}