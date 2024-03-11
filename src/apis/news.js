// 封装站点查询相关接口
import request from '../utils/http'

// 模糊查询站点
export const getNewsFrom12306API = () => {
  return request[1]({
    url: 'index/otn/index12306/getNews',
    method: 'get',
  })
}