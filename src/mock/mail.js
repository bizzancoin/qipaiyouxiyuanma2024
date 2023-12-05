import Mock from 'mockjs'
import {
  param2Obj,
  //body2Obj
} from '@/utils'

let List = []
const count = 100

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    playerId: '@integer(0, 1, 2)',
    playerSuperId: Mock.Random.integer(),
    playerName: '@cname',
    fromPlayerId: Mock.Random.integer(),
    fromPlayerSuperId: Mock.Random.integer(),
    fromPlayerName: '@cname',
    gold: Mock.Random.integer(),
    title: '@ctitle(10, 20)',
    isRead: '@integer(0, 1)',
    isRecGold: '@integer(0, 1)',
    createTime: Mock.Random.date('T'),
    content: '@ctitle(10, 20)'
  }))
}

List.push(Mock.mock({
  id: '@increment',
  playerId: 123,
  playerSuperId: 123,
  playerName: '1234567',
  fromPlayerId: Mock.Random.integer(),
  fromPlayerSuperId: Mock.Random.integer(),
  fromPlayerName: '@cname',
  gold: Mock.Random.integer(),
  title: '@ctitle(10, 20)',
  isRead: '@integer(0, 1)',
  isRecGold: '@integer(0, 1)',
  createTime: Mock.Random.date('T'),
  content: '@ctitle(10, 20)'
}));

List.reverse();

export default {
  getMailList: config => {
    const {
      page = 1, pageSize = 20, playerId
    } = param2Obj(config.url)
    let mockList = List.filter(item => {
      if (playerId && item.playerId != playerId) {
        return false;
      }
      return true;
    })

    const pageList = mockList.filter((item, index) => index < pageSize * page && index >= pageSize * (page - 1))

    return {
      code: 200,
      msg: '的示范法',
      map: {
        total: mockList.length,
        list: pageList
      }
    }
  },
  addMail: config => {
    let mail = JSON.parse(config.body);

    mail= Mock.mock({
      id: '@increment',
      playerId: mail.playerId,
      playerSuperId: mail.playerId,
      playerName: '@cname',
      fromPlayerId: 0,
      fromPlayerSuperId: 0,
      fromPlayerName: '系统',
      gold: Mock.Random.integer(),
      title: mail.title,
      isRead: 0,
      isRecGold: 0,
      createTime: new Date().getTime(),
      content: mail.content
    })
    
    List.unshift(mail);
    return {
      code: 200,
      msg: "success",
      map: {}
    };
  },
  deleteMail: config => {
    const ids = JSON.parse(config.body);
    if (ids && ids.length) {
      List = List.filter(item => {
        return ids.indexOf(item.id) === -1
      })
    }

    return {
      code: 200,
      msg: "success",
      map: {}
    };
  }
}
