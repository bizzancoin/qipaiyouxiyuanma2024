import request from '@/utils/request'

export function playerSearch(query) {
  return request({
    url: '/search/player',
    method: 'get',
    params: { query: query }
  })
}
