import { defineStore } from "pinia"
import { ref } from 'vue'
export const mapStore = defineStore('map', () => {

  //在这里写高德地图的key和密码
  const key = ref('9691f84d3fecb4553e47a69aa9f9f637');
  const password = ref('05f4eb735b1afeddce10dfd3fb572a0a')

  return{
    key,
    password
  }
})

