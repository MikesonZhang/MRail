// 封装站点查询相关接口
import request from '@/utils/http'

// 模糊查询站点
export const searchStationAPI = ( key ) => {
  const payload = {
    stationKey:key.value
  }
  return request[0]({
    url: '/searchStation',
    method: 'get',
    params: payload,
  })
}

//翻译站点电报码
export const translateStationNameAPI = ( key ) => {
  const payload = {
    stationKey:key
  }
  return request[0]({
    url: '/translateStationName',
    method: 'get',
    params: payload,
  })
}