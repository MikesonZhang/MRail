<script setup>
  import { onMounted, ref, inject } from 'vue';
  import { getTicketsInfoFrom12306API,getTrainInfoFrom12306API } from '../../apis/tickets'
  import { useStationStore } from '../../stores/stationPinia'

  const tableData = ref([])
  const stationInfo = ref({})
  // 车次信息弹窗打开
  const drawerVisible = ref(false)
  // 车次信息弹窗的数据
  const drawerData = ref({
    data:[],
    row:{}
  })

  // 第一次票务数据请求
  async function getTicketsInfoFrom12306AtFirst(){
    const station = useStationStore()
    let data = {
      'train_date':station.startTimeDate,
      'from_station':station.startStationInfo.station_code,
      'to_station':station.endStationInfo.station_code,
      'purpose_codes':'ADULT'
    }
    const res = await getTicketsInfoFrom12306API(data)
    
    stationInfo.value = res.data
    tableData.value = stationInfo.value.result
  }

  //对表格的车站名进行翻译
  function formatStation(stationCode){
    // 遍历对象的键值对，查找与给定的stationCode匹配的值，并返回相应的键
    for (const [key, value] of Object.entries(stationInfo.value.map)) {
      if (key == stationCode) {
        return value; // 如果找到匹配的值，返回对应的键
      }
    }
    return null; // 如果没有找到匹配的值，返回null或其他你认为合适的值
  }
  // 局部刷新函数
  const refresh = inject("reload")
  
  async function getTrainInfoFrom12306ToDrawer(row){
    const { startTime,departureStation,destinationStation,id} = row
    let data = {
      "depart_date":formatStartTime(startTime),
      "train_no":id,
      "from_station_telecode":departureStation,
      "to_station_telecode":destinationStation
    }
    const res = await getTrainInfoFrom12306API(data);
    drawerData.value.data = res.data.result.data
    drawerData.value.row = row
    drawerVisible.value = true
  }

  function formatStartTime(startTime){
    const year = startTime.substring(0, 4);
    const month = startTime.substring(4, 6);
    const day = startTime.substring(6, 8);

    return `${year}-${month}-${day}`;
  }

  onMounted(async ()=>{
    await getTicketsInfoFrom12306AtFirst();
  })
</script>
<template>
  <div class="mainBox">
    <el-table 
      :data="tableData" 
      height="600" 
      stripe 
      border 
      :highlight-current-row="true"
      :header-cell-style="{ background: 'linear-gradient(rgb(54,153,214), rgb(28,126,194))', color: 'white',border:'none','text-align': 'center' }"
    >
      <el-table-column prop="trainNumber" label="车次" width="70" align="center">
        <template v-slot="{ row }">
          <!-- 在这里进行格式化 -->
          <span @click="getTrainInfoFrom12306ToDrawer(row)" class="trainNumber">{{ row.trainNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="tripDepartureStation" label="出发站" align="center">
        <template v-slot="{ row }">
          <!-- 在这里进行格式化 -->
          {{ formatStation(row.tripDepartureStation) }}
        </template>
      </el-table-column>
      <el-table-column prop="tripDestinationStation" label="到达站" align="center">
        <template v-slot="{ row }">
          <!-- 在这里进行格式化 -->
          {{ formatStation(row.tripDestinationStation) }}
        </template>
      </el-table-column>
      <el-table-column prop="departureTime" label="出发时间" width="80" align="center"/>
      <el-table-column prop="arrivalTime" label="到达时间" width="80" align="center"/>
      <el-table-column prop="duration" label="历时" width="70" align="center"/>
      <el-table-column prop="businessClassSeats" label="商务/特等座" width="110" align="center">
        <template v-slot="{ row }">
          <!-- 在这里进行格式化 -->
          <template v-if="row.businessClassSeats!=''">
            {{ row.businessClassSeats }}/¥{{ parseFloat(row.businessClassSeatsPrice / 10).toFixed(1) }}
          </template>
          <template v-else>
            -
          </template>
        </template>
      </el-table-column>
      <el-table-column prop="firstClassSeats" label="一等座" width="100" align="center" >
      <template v-slot="{ row }">
          <!-- 在这里进行格式化 -->
          <template v-if="row.firstClassSeats!=''">
            {{ row.firstClassSeats }}/¥{{ parseFloat(row.firstClassSeatsPrice / 10).toFixed(1) }}
          </template>
          <template v-else>
            -
          </template>
        </template>
      </el-table-column>
      <el-table-column prop="secondClassSeats" label="二等座" width="100" align="center">
        <template v-slot="{ row }">
          <!-- 在这里进行格式化 -->
          <template v-if="row.secondClassSeats!=''">
            {{ row.secondClassSeats }}/¥{{ parseFloat(row.secondClassSeatsPrice / 10).toFixed(1) }}
          </template>
          <template v-else>
            -
          </template>
        </template>
      </el-table-column>
      <el-table-column prop="HighSoftsleeper" label="高级软卧" align="center">
        <template v-slot="{ row }">
          <!-- 在这里进行格式化 -->
          <template v-if="row.HighSoftsleeper!=''">
            {{ row.HighSoftsleeper }}/¥{{ parseFloat(row.HighSoftsleeperPrice / 10).toFixed(1) }}
          </template>
          <template v-else>
            -
          </template>
        </template>
      </el-table-column>
      <el-table-column prop="softsleeper" label="软卧/一等卧" width="110" align="center">
        <template v-slot="{ row }">
          <!-- 在这里进行格式化 -->
          <template v-if="row.softsleeper!=''">
            {{ row.softsleeper }}/¥{{ parseFloat(row.softsleeperPrice / 10).toFixed(1) }}
          </template>
          <template v-else>
            -
          </template>
        </template>
      </el-table-column>
      <el-table-column prop="CRHSleeper" label="动卧" align="center">
        <template v-slot="{ row }">
          <!-- 在这里进行格式化 -->
          <template v-if="row.CRHSleeper!=''">
            {{ row.CRHSleeper }}/¥{{ parseFloat(row.CRHSleeperPrice / 10).toFixed(1) }}
          </template>
          <template v-else>
            -
          </template>
        </template>
      </el-table-column>
      <el-table-column prop="hardsleeper" label="硬卧/一等卧" width="110" align="center">
        <template v-slot="{ row }">
          <!-- 在这里进行格式化 -->
          <template v-if="row.hardsleeper!=''">
            {{ row.hardsleeper }}/¥{{ parseFloat(row.hardsleeperPrice / 10).toFixed(1) }}
          </template>
          <template v-else>
            -
          </template>
        </template>
      </el-table-column>
      <el-table-column prop="softSeat" label="软座" width="100" align="center">
        <template v-slot="{ row }">
          <!-- 在这里进行格式化 -->
          <template v-if="row.softSeat!=''">
            {{ row.softSeat }}/¥{{ parseFloat(row.softSeatPrice / 10).toFixed(1) }}
          </template>
          <template v-else>
            -
          </template>
        </template>
      </el-table-column>
      <el-table-column prop="hardSeat" label="硬座" width="100" align="center">
        <template v-slot="{ row }">
          <!-- 在这里进行格式化 -->
          <template v-if="row.hardSeat!=''">
            {{ row.hardSeat }}/¥{{ parseFloat(row.hardSeatPrice / 10).toFixed(1) }}
          </template>
          <template v-else>
            -
          </template>
        </template>
      </el-table-column>
      <el-table-column prop="noSeat" label="无座" width="100" align="center">
        <template v-slot="{ row }">
          <!-- 在这里进行格式化 -->
          <template v-if="row.noSeat!=''">
            {{ row.noSeat }}/¥{{ parseFloat(row.noSeatPrice / 10).toFixed(1) }}
          </template>
          <template v-else>
            -
          </template>
        </template>
      </el-table-column>
      <el-table-column prop="other" label="其他" align="center">
        <template v-slot="{ row }">
          <!-- 在这里进行格式化 -->
          <template v-if="row.other!=''">
            {{ row.other }}/¥{{ parseFloat(row.otherPrice / 10).toFixed(1) }}
          </template>
          <template v-else>
            -
          </template>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center">
        <template #default="scope">
          <div class="myButton">
            <el-button type="primary" class="bookingButton">预定{{scope.trainNumber}}</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    
    <el-drawer v-model="drawerVisible" :title="drawerData.data[0].station_train_code+' '+drawerData.data[0].station_name+'开往'+drawerData.data[0].end_station_name" v-if="drawerVisible">
      <el-table :data="drawerData.data">
        <el-table-column type="index" label="站序" width="80" align="center" />
        <el-table-column prop="station_name" label="站名" align="center" />
        <el-table-column prop="arrive_time" label="到站时间" align="center" />
        <el-table-column prop="start_time" label="出发时间" align="center" />
        <el-table-column prop="stopover_time" label="停靠时间" align="center" />
      </el-table>
    </el-drawer>
    <el-drawer title="错误" v-else>
      <span>数据还未加载完成，请稍后!</span>
    </el-drawer>
  </div>
</template>

<style scoped lang="scss">
.mainBox{
  overflow-y: hidden;
}
.bookingButton{
  color: white;
  width: 80%;
  background-color: rgb(32,143,255);
}
:deep(.el-drawer__title){
  font-size: 18px;
  font-weight: 500;
}
.trainNumber{
  color: black;
  font-weight: 500;
  text-decoration: underline
}

</style>