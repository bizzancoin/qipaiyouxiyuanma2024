import Mock from 'mockjs'
import {
//   param2Obj,
  //body2Obj
} from '@/utils'

let NoticeList = []

NoticeList.push(Mock.mock({
    noticeId: '@increment',
    marquee:1,
    sysNotice:1,
    content: '神话乐园游戏中心欢迎您，游客请立刻升级账号，推荐人必须填写客服给你的推荐号。',
    startTime: Mock.Random.date('T'),
    finalTime: Mock.Random.date('T'),
    timestamp: 6,
}));

export default {
    getNoticeList: () => {
      return {
        code: 200,
        msg: '成功',
        map: {
          list: NoticeList
        }
      }
    },
    addNotice:config=>{
        let msg = JSON.parse(config.body);
        if(msg.noticeId){
            NoticeList.filter(item => {
                if(msg.noticeId == item.noticeId){
                    item.marquee = item.marquee;
                    item.sysNotice = item.sysNotice;
                    item.content= msg.content;
                    item.startTime= msg.startTime;
                    item.finalTime= msg.finalTime;
                    item.timestamp=msg.timestamp;
                }
            })
        }
        else{
            NoticeList.push(Mock.mock({
                noticeId: '@increment',
                sysNotice : msg.sysNotice,
                marquee : msg.marquee,
                content: msg.content,
                startTime: msg.startTime,
                finalTime: msg.finalTime,
                timestamp: msg.timestamp
            }))
        }
        return {
            code: 200,
            msg: "success",
            map: {}
        };
    },
    delNotice: config => {
        const ids = JSON.parse(config.body);
        if (ids && ids.length) {
            NoticeList = NoticeList.filter(item => {
                return ids.indexOf(item.noticeId) === -1
            })
        }
    
        return {
          code: 200,
          msg: "success",
          map: {}
        };
      }

}

  