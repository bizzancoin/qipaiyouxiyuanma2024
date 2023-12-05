import Mock from 'mockjs'
import {
  param2Obj,
  //body2Obj
} from '@/utils'

let GameList = []

GameList.push(Mock.mock({
  id: '@increment',
  gameId: 1,
  gameType: 1,
  gameName: '水浒传',
}));
GameList.push(Mock.mock({
  id: '@increment',
  gameId: 2,
  gameType: 1,
  gameName: '水果拉霸',
}));
GameList.push(Mock.mock({
  id: '@increment',
  gameId: 3,
  gameType: 1,
  gameName: '飞禽走兽',
}));


let RoomList = []
const count = 50

for (let i = 0; i < count; i++) {
  RoomList.push(Mock.mock({
    roomId: '@increment', //房间id
    gameId: '@integer(1, 3)', //游戏
    name: '@cname', //房间名
    type: '@integer(1, 5)', //房间类型
    maxNum: '@integer(50, 500)', //最大人数
    tableNum: '@integer(10, 50)', //桌子数
    tableSeat: '@integer(2, 10)', //每桌人数
    lower: '@integer(1000, 10000)', //进入下限
    upper: '@integer(10000, 100000)', //进入上限
    free: '@integer(1, 49)', //空闲人数百分比
    genera: '@integer(50, 69)', //普通人数百分比
    crowded: '@integer(70, 95)', //拥挤人数百分比
    full: '@integer(96, 100)', //爆满人数百分比
    proportionGold: 1, //金币筹码比率-金币
    proportionChips: 1, //金币筹码比率-筹码
    defMinChip: '@integer(5000, 50000)', //默认最低筹码
    defMaxChip: '@integer(50000, 500000)', //默认最高筹码
    afee: 3, //台费
    gambleMax: 5000000, //单局上限（筹码）
    inType: '@integer(0, 1)', //进入类型（0点击入座，1自动分配
    createTime: Mock.Random.date('T'), //创建时间
    openTime: Mock.Random.date('T'), //开启时间
    status: '@integer(0, 1)' //状态，开启关闭
  }))
}


export default {
  getGameList: () => {
    return {
      code: 200,
      msg: '成功',
      map: {
        list: GameList
      }
    }
  },
  getRoomList: config => {
    const {
      page = 1, pageSize = 20, gameId
    } = param2Obj(config.url)
    const gameRooms = RoomList.filter(item => item.gameId == gameId)
    const pageList = gameRooms.filter((item, index) => index < pageSize * page && index >= pageSize * (page - 1))
    console.log(gameRooms)
    return {
      code: 200,
      msg: '成功',
      map: {
        total: gameRooms.length,
        list: pageList
      }
    }
  },
  changeRoomStatus: config => {
    const {
      ids,
      status
    } = JSON.parse(config.body);

    if (ids && ids.length) {
      RoomList.filter(item => {
        if (ids.indexOf(item.roomId) > -1) {
          item.status = status;
        }
      })
    }
    return {
      code: 200,
      msg: "success",
      map: {}
    };
  },
  addGameRoom: config => {
    let room = JSON.parse(config.body);
    if (room.roomId) {
      RoomList.filter(item => {
        if (room.roomId == item.roomId) {
          item.status = status;
          item.name = room.name;
          item.type = room.type;
          item.maxNum = room.maxNum;
          item.tableNum = room.tableNum;
          item.tableSeat = room.tableSeat;
          item.lower = room.lower;
          item.upper = room.upper;
          item.free = room.free;
          item.genera = room.genera;
          item.crowded = room.crowded;
          item.full = room.full;
          item.proportionGold = room.proportionGold;
          item.proportionChips = room.proportionChips;
          item.defMinChip = room.defMinChip;
          item.defMaxChip = room.defMaxChip;
          item.afee = room.afee;
          item.gambleMax = room.gambleMax;
          item.inType = room.inType;
        }
      })
    } else {
      RoomList.push(Mock.mock({
        roomId: '@increment', //房间id
        gameId: room.gameId, //游戏
        name: room.name, //房间名
        type: room.type, //房间类型
        maxNum: room.maxNum, //最大人数
        tableNum: room.tableNum, //桌子数
        tableSeat: room.tableSeat, //每桌人数
        lower: room.lower, //进入下限
        upper: room.upper, //进入上限
        free: room.free, //空闲人数百分比
        genera: room.genera, //普通人数百分比
        crowded: room.crowded, //拥挤人数百分比
        full: room.full, //爆满人数百分比
        proportionGold: room.proportionGold, //金币筹码比率-金币
        proportionChips: room.proportionChips, //金币筹码比率-筹码
        defMinChip: room.defMinChip, //默认最低筹码
        defMaxChip: room.defMaxChip, //默认最高筹码
        afee: room.afee, //台费
        gambleMax: room.gambleMax, //单局上限（筹码）
        inType: room.inType, //进入类型（0点击入座，1自动分配
        createTime: Mock.Random.date('T'), //创建时间
        openTime: Mock.Random.date('T'), //开启时间
        status: 0 //状态，开启关闭
      }))
    }

    return {
      code: 200,
      msg: "success",
      map: {}
    };
  }
}
