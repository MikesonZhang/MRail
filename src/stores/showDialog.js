import { defineStore } from "pinia"
import { ref } from 'vue'


export const useShowDialogVisible = defineStore('showDialogVisible', () => {

  //在这里写高德地图的key和密码
  const stopSelectionVisible = ref(false)

  return{
    stopSelectionVisible,
  }
  
},{
  persist: true,
})

