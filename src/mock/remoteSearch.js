import Mock from 'mockjs'
import { param2Obj } from '@/utils'

const NameList = []
const count = 100

for (let i = 0; i < count; i++) {
  NameList.push(Mock.mock({
    playerId: Mock.Random.integer(),
    playerSuperId: Mock.Random.integer(),
    playerName:  '@cname',
    phone: Mock.Random.integer(100000000,999999999)
  }))
}
NameList.push({
  playerId: 123,
  playerSuperId: 123,
  playerName:  '1234567',
  phone: 13645000074
});

export default {
  playerSearch: config => {
    const { query } = param2Obj(config.url);
    console.log("query", query);
    const mockNameList = NameList.filter(item => {
      const lowerCaseName = item.playerName.toLowerCase();
      if (query && lowerCaseName.indexOf(query.toLowerCase()) < 0) return false;
      return true;
    });
    return { code: 200,
             map: { 
                   list: mockNameList
                  },
             msg:'1212' };
  }
}
