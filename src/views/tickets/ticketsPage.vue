<script setup>
  import { ref, onMounted, onBeforeMount } from 'vue';
  import router from '../../routers/index'
  import ticketsSearchBox from "../../components/ticketsPage/ticketsSearchBox.vue"
  import ticketsResultTable from "../../components/ticketsPage/ticketsResultTable.vue"
  
  import { useStationStore } from '../../stores/stationPinia'

  const tripInfo = ref({
    fs:'',
    fsCode:'',
    ts:'',
    tsCode:'',
    date:'',
    purpose_codes:'ADULT'
  })
  
  const activeTime = ref('')
  const timeList = ref([])
  
  //检测请求是否加载完毕
  const isLoad = ref(false)

  // 从地址栏获取参数
  function getParamsFromUrl(){
    const urlString = decodeURIComponent(window.location.href);
    const queryString = urlString.substring(urlString.indexOf('?') + 1); // 获取问号后的查询字符串部分

    // 按照 & 分割查询字符串，然后遍历每个键值对
    const paramsArray = queryString.split('&');
    const params = {};
    paramsArray.forEach(param => {
        const keyValue = param.split('=');
        const key = keyValue[0];
        const value = decodeURIComponent(keyValue[1]); // 对值进行解码
        params[key] = value;
    });

    tripInfo.value.fs = params['fs'];
    tripInfo.value.ts = params['ts'];
    tripInfo.value.date = params['date'];
  }
  // 从pinia获取选择的车站信息
  function getStationFromPinia(){
    const station = useStationStore()
    tripInfo.value.fsCode = station.startStationInfo.station_code
    tripInfo.value.tsCode = station.endStationInfo.station_code
  }

  // 初始化筛选盒子的时间
  function initTimeList(){
    const station = useStationStore();
    // 获取起始日期
    const startDate = new Date(station.startTimeDate);
    // 循环添加 15 天的数据
    for (let index = 0; index < 15; index++) {
        let tempDate = {
            date: formatDate(startDate), // 格式化日期为 "YYYY-MM-DD"
            label: formatLabel(startDate) // 格式化月份和日期为 "MM-DD"
        };

        // 添加当前日期到 timeList
        timeList.value.push(tempDate);

        // 增加一天
        startDate.setDate(startDate.getDate() + 1);
    }
    
    // 返回 timeList
  }

  // 辅助函数：将日期对象格式化为 "YYYY-MM-DD" 的字符串
  function formatDate(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从 0 开始，需要加 1
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
  }

  // 辅助函数：将日期对象格式化为 "MM-DD" 的字符串
  function formatLabel(date) {
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${month}-${day}`;
  }

  onMounted(async() => {

    initTimeList();
    getParamsFromUrl();
    getStationFromPinia();
    //请求加载完毕
    isLoad.value = true
    
  });
</script>

<template>
  <div class="mainBox" v-if="isLoad">
    <tickets-search-box class="ticketsSearchBox" :info="tripInfo"/>
    <div class="filterBox" id="filterBox">
      <el-tabs v-model="activeTime" type="card" class="demo-tabs">
        <el-tab-pane :label="item.label" :name="item.date"  v-for="(item,index) in timeList" :key="index">
          
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="ticketsResultTableBox">
      <ticketsResultTable :info="tripInfo"/>
    </div>
  </div>
  <div v-else>
    数据还未加载完成，请稍后
  </div>
</template>

<style scoped lang="scss">
.mainBox{
  width: 100%;
  overflow-y: hidden;
  .ticketsSearchBox{
    margin-left: 1%;
    width: 98%;
    height: 80px;
  }
}
.filterBox{
  width: 98%;
  margin-left: 1%;
  margin-top: 1%;
  height: 150px;
  border: 1px solid rgb(41,140,206);
}
:deep(.el-tabs__item.is-top){
  height: 40px;
  width: 107.58px;
}
.ticketsResultTableBox{
  width: 98%;
  margin-left: 1%;
  margin-top: 1%;
  border: 1px solid rgb(41,140,206);
}
</style>