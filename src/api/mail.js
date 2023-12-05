import request from '@/utils/request'

export function getMailList(param) {

  return request({
    url: '/mail/list',
    method: 'get',
    params: param
  })
}

export function addMail(mail) {
  return request({
    url: '/mail/add',
    method: 'post',
    data: mail
  })
}

export function deleteMail(ids) {
  return request({
    url: '/mail/delete',
    method: 'post',
    data: ids
  })
}
