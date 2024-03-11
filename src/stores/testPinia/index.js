import { defineStore } from "pinia"
import { ref } from 'vue'
export const userStore = defineStore('user', () => {
  //导航列表的数据管理
  //state 导航列表数据
  const name = ref('zhangsan');
  const age = ref(18)

  return{
    name,
    age
  }
})

