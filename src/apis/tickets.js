// 封装站点查询相关接口
import request from '../utils/http'

// 查询车票信息
export const getTicketsInfoFrom12306API = (param) => {
  return request[0]({
    url: '/getTicketsInfoFrom12306',
    method: 'get',
    params: param
  })
}

export const getTrainInfoFrom12306API = (param) =>{
  return request[0]({
    url: '/getTrainInfoFrom12306',
    method: 'get',
    params: param
  })
}