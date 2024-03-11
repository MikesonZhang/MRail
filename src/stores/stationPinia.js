import { defineStore } from "pinia"
import { ref } from 'vue'


export const useStationStore = defineStore('station', () => {

  //在这里写高德地图的key和密码
  const startStationInfo = ref({})
  const endStationInfo = ref({})
  const startTimeDate = ref('')

  return{
    startStationInfo,
    endStationInfo,
    startTimeDate
  }
  
},{
  persist: true,
})

