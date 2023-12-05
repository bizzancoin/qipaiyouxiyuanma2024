import request from '@/utils/request'

export function getList(param) {

  return request({
    url: '/channel/list',
    method: 'get',
    params: param
  })
}

export function saveChannel(thirdChannel) {
  return request({
    url: '/channel/save',
    method: 'post',
    data: thirdChannel
  })
}

export function deleteChannel(channelId) {
  return request({
    url: '/channel/delete',
    method: 'post',
    data: {channelId:channelId},
    headers: {
      'Content-type': 'application/x-www-form-urlencoded'
    }
  })
}