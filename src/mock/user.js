import Mock from 'mockjs'
import {
  param2Obj,
  //body2Obj
} from '@/utils'

let UserList = [];
const count = 100;
for(let i = 0; i < count; i++) {
  let playerId = '@increment';
  UserList.push(Mock.mock({
    id: '@increment',
    playerId: playerId,
    superId: playerId,
    userName: '@ctitle(4, 8)',
    nickName: '@cname',
    phone: /^1[0-9]{10}$/,
    totalGold: Mock.Random.integer(5000000, 10000000),
    gold: Mock.Random.integer(0, 5000000),
    safeGold: Mock.Random.integer(0, 5000000),
    onlineState: '@integer(0, 1)',
    state: '@integer(0, 1)',
    loginTime: '@DATETIME("yyyy-MM-dd HH:mm:ss")',
    loginPlace: '@province(true)'
  }));
}

let RoomList = [];
RoomList.push(Mock.mock({
  value: 1,
  label: "新手场"
}));
RoomList.push(Mock.mock({
  value: 2,
  label: "普通场"
}));
RoomList.push(Mock.mock({
  value: 3,
  label: "高级场"
}));
RoomList.push(Mock.mock({
  value: 4,
  label: "大师场"
}));

export default {
  findUserList: config=>{
    const {
      page = 1, pageSize = 20
    } = param2Obj(config.url)
    let mockList = UserList.filter(item => {
      if(item.playerId) {
        return true;
      } 
      return false;
    })
    const pageList = mockList.filter((item, index) => index < pageSize * page && index >= pageSize * (page - 1))
    return {
      code: 200,
      msg: '成功',
      map: {
        list: pageList,
        total: mockList.length
      }
    }
  },
  findOnlineList: config=>{
    const {
      page = 1, pageSize = 20
    } = param2Obj(config.url)
    let mockList = UserList.filter(item => {
      if(item.playerId && item.onlineState) {
        return true;
      } 
      return false;
    })
    const pageList = mockList.filter((item, index) => index < pageSize * page && index >= pageSize * (page - 1))
    return {
      code: 200,
      msg: '成功',
      map: {
        list: pageList,
        total: mockList.length
      }
    }
  },
  findGameRoom: config=> {
    const {
      gameId
    } = param2Obj(config.url)
    let returnList = [];
    if(gameId) {
      returnList = RoomList;
    }
    return {
      code: 200,
      msg: '成功',
      map: {
        list: returnList
      }
    }
  },
  sendGold: config=>{
    console.log("sendGold", config.body);
    return {
      code: 200,
      msg: '',
      map:{}
    }
  },
  sendSafeGold: config=>{
    console.log("sendSafeGold", config.body);
    return {
      code: 200,
      msg: '',
      map:{}
    }
  },
  setSuperId: config=>{
    console.log("setSuperId", config.body);
    return {
      code: 200,
      msg: '',
      map:{}
    }
  },
  batchLock: config=>{
    console.log("batchLock", config.body);
    return {
      code: 200,
      msg: '',
      map:{}
    }
  },
  activePlayer: config=>{
    console.log("activePlayer", config.body);
    return {
      code: 200,
      msg: '',
      map:{}
    }
  }
}