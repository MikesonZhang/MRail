// axios基础的封装
import axios from 'axios'
import { ElMessage } from 'element-plus'
// import { useUserStore } from '@/stores/userStore'

function request(config){
  //1.创建axios实例
  const httpInstance = axios.create({
      baseURL:"http://localhost:8081/",
      timeout:5000
  })
//2.再创建一个axios实例，用来放第二个baseURL
  const http12306 = axios.create({
      baseURL:"https://kyfw.12306.cn/",
      timeout:5000,
  })
  //发送真正的网络请求
  return [httpInstance,http12306]
}
export default request()
