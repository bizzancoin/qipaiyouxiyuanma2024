import request from '@/utils/request'

// // 获取游戏列表
// export function findGameList() {
//   return request({
//     url: '/common/findGameList',
//     method: 'post'
//   });
// }

// // 获取房间列表
// export function findRoomList(gameId) {
//   return request({
//     url: '/common/findRoomListByGameId',
//     method: 'post',
//     data: { gameId: gameId },
//     headers: {
//       'Content-type': 'application/x-www-form-urlencoded'
//     }
//   });
// }


export function getChannel(param) {

  return request({
    url: '/common/channel',
    method: 'get',
    params: param
  })
}


// 获取档位(困难度)
export function findStallList(gameId) {
  return request({
    url: '/common/findCtlInfo',
    method: 'post',
    data: { gameId: gameId },
    headers: {
      'Content-type': 'application/x-www-form-urlencoded'
    }
  });
}