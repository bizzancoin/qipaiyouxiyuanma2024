import Mock from 'mockjs'
import loginAPI from './login'
import articleAPI from './article'
import remoteSearchAPI from './remoteSearch'
import transactionAPI from './transaction'
// import emailAPI from './mail'
import gamesAPI from './games'
// import noticeAPI from './notice'
// import userAPI from './user'

Mock.setup({
  timeout: '350-600'
})

// 登录相关 
 Mock.mock(/\/login/, 'post', loginAPI.loginByUsername)
 Mock.mock(/\/logout/, 'post', loginAPI.logout)
 Mock.mock(/\/account\/info\.*/, 'get', loginAPI.getUserInfo)

// 文章相关
Mock.mock(/\/article\/list/, 'get', articleAPI.getList)
Mock.mock(/\/article\/detail/, 'get', articleAPI.getArticle)
Mock.mock(/\/article\/pv/, 'get', articleAPI.getPv)

// 邮件
// Mock.mock(/\/mail\/list/,'get', emailAPI.getMailList);
// Mock.mock(/\/mail\/add/, 'post', emailAPI.addMail);
// Mock.mock(/\/mail\/delete/,'post' ,emailAPI.deleteMail);

// 搜索相关
Mock.mock(/\/search\/player/, 'get', remoteSearchAPI.playerSearch)

// 账单相关
Mock.mock(/\/transaction\/list/, 'get', transactionAPI.getList)

//游戏
// Mock.mock(/\/games\/list/,'get', gamesAPI.getGameList);
Mock.mock(/\/games\/roomlist/,'get', gamesAPI.getRoomList);
Mock.mock(/\/games\/changeroomstatus/,'post' ,gamesAPI.changeRoomStatus);
Mock.mock(/\/games\/addgameroom/,'post' ,gamesAPI.addGameRoom);

//公告
// Mock.mock(/\/notice\/list/,'get' ,noticeAPI.getNoticeList);
// Mock.mock(/\/notice\/add/,'post' ,noticeAPI.addNotice);
// Mock.mock(/\/notice\/del/,'post' ,noticeAPI.delNotice);

//用户
// Mock.mock(/\/user\/list/, 'get', userAPI.findUserList);
// Mock.mock(/\/games\/simpleroomlist/, 'get', userAPI.findGameRoom);
// Mock.mock(/\/user\/onlineList/, 'get', userAPI.findOnlineList)
// Mock.mock(/\/user\/sendGold/, 'post', userAPI.sendGold);
// Mock.mock(/\/user\/sendSafeGold/, 'post', userAPI.sendSafeGold);
// Mock.mock(/\/user\/setSuperId/, 'post', userAPI.setSuperId);
// Mock.mock(/\/user\/batchLock/, 'post', userAPI.batchLock);
// Mock.mock(/\/user\/activePlayer/, 'post', userAPI.activePlayer);
export default Mock
