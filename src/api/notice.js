import request from '@/utils/request'

export function getNoticeList(param) {
  return request({
    url: '/notice/list',
    method: 'get',
    params: param
  })
}
export function addNotice(param) {
    return request({
        url: '/notice/save',
        method: 'post',
        data: param
    })
    }
export function sendNotice(param) {
    return request({
        url: '/notice/send',
        method: 'post',
        data: param,
        headers: {
          'Content-type': 'application/x-www-form-urlencoded'
        }
    })
    }
export function delNotice(param) {
    return request({
        url: '/notice/delete',
        method: 'post',
        data: param,
        headers: {
          'Content-type': 'application/x-www-form-urlencoded'
        }
    })
    }