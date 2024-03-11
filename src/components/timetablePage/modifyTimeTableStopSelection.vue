<!-- 自定义运行图车次管理本线经停选择组件 -->
<script setup>
  import { ref, onMounted } from 'vue';
  import MRwatermark from '../common/MRwatermark.vue'  
  import { v4 as uuidv4 } from 'uuid';
  const props = defineProps(['lineList','StopSelectionVisible','site']);
  const emit = defineEmits(['updateStopSelection']);

  //从props获取dialog的信息
  const _dialogInfo = props.StopSelectionVisible

  //经停站点列表
  const StopList = ref([])

  //是否是编辑状态
  const isEdit = ref(false)

  //插入的经停站点
  const insertStopStation = ref({
    id:'',
    station_name:'',
    stationId:'',
    line:'',
    arrive_time:'',
    start_time:'',
    stopover_time:'',
    speed:''
  })

  /**
   * 关闭弹窗的回调方法 _dialogInfo他是一个reactive 他是一个引用类型，我下面的代码通过地址指针去修改了它
   * 所以这里不需要用emit，因为emit去父组件触发，会让vue报警告，因为我采用这种方式之前就是，在父组件创建了
   * 一个更新方法，子组件触发这个更新方法，然后父组件更新数据，但是这样影响了vue的数据流，改变了props的值
   * 是vue不推荐的方法，所以这里采用直接从地址指针去修改_dialogInfo(父组件层是stopSelectionVisible),所以不会造成
   * props的值修改。
   */
  const closeDialog = () => {
    // 这里如果不深拷贝会导致父组件的stopStationList被修改
    let ReceiveData = JSON.parse(JSON.stringify(StopList.value));
    emit('updateStopSelection',ReceiveData);
    StopList.value = []
    _dialogInfo.isShow = false
  };

  const openDialog = () =>{
    if(props.site.length != 0){
      StopList.value = props.site
    }
    
  }

  //确认新增本线经停站点
  function enSureInsertStation(){
    const uniqueId = uuidv4();
    //Vue3如果直接push,传过去的是浅拷贝，需要按照下面进行深拷贝
    let obj = {
      id: uniqueId,
      station_name: insertStopStation.value.station_name,
      stationId: getStationId(insertStopStation.value.station_name),
      arrive_time: insertStopStation.value.arrive_time,
      start_time: insertStopStation.value.start_time,
      stopover_time:calculateStopoverTime(insertStopStation.value.start_time, insertStopStation.value.arrive_time),
      speed: insertStopStation.value.speed,
      line: props.lineList[0].line,
    }
    StopList.value.push(obj)

    insertStopStation.value.station_name = ''
    insertStopStation.value.arrive_time = ''
    insertStopStation.value.start_time = ''
    insertStopStation.value.stopover_time = ''
    insertStopStation.value.speed = ''
  }

  //时间格式化函数
  function formatTime(startTime){
    const date = new Date(startTime);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }
  // 计算停留时间
  function calculateStopoverTime(startTime, arriveTime) {
    if(typeof(startTime) == 'string'){
      startTime = new Date(startTime);
    }
    if(typeof(arriveTime) == 'string'){
      arriveTime = new Date(arriveTime);
    }
    const timeDifference = startTime.getTime() - arriveTime.getTime();
    const stopoverHours = Math.floor(timeDifference / (1000 * 60 * 60));
    const stopoverMinutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
    return `${stopoverHours.toString().padStart(2, '0')}:${stopoverMinutes.toString().padStart(2, '0')}`;
  }

  //编辑经停站点
  function editStopStation(scope){
    insertStopStation.value.id = scope.id
    insertStopStation.value.station_name = scope.station_name
    insertStopStation.value.stationId = scope.stationId
    insertStopStation.value.arrive_time = scope.arrive_time
    insertStopStation.value.start_time = scope.start_time
    insertStopStation.value.speed = scope.speed
    isEdit.value = true
  }

  //确认编辑经停站点
  function enSureEditStation(){
    
    //Vue3如果直接push,传过去的是浅拷贝，需要按照下面进行深拷贝
    let obj = {
      id:insertStopStation.value.id,
      station_name: insertStopStation.value.station_name,
      stationId: getStationId(insertStopStation.value.station_name),
      arrive_time: insertStopStation.value.arrive_time,
      start_time:insertStopStation.value.start_time,
      stopover_time:calculateStopoverTime(insertStopStation.value.start_time, insertStopStation.value.arrive_time),
      speed:insertStopStation.value.speed,
      line:props.lineList[0].line
    }

    //更新原有的站点信息
    for (let index = 0; index < StopList.value.length; index++) {
      if(StopList.value[index].id == obj.id){
        StopList.value[index].station_name = obj.station_name
        StopList.value[index].stationId = obj.stationId
        StopList.value[index].arrive_time = obj.arrive_time
        StopList.value[index].start_time = obj.start_time
        StopList.value[index].speed = obj.speed
        StopList.value[index].line = obj.line
        StopList.value[index].stopover_time = obj.stopover_time
      }
    }
    
    //重置插入站点框
    insertStopStation.value.station_name = ''
    insertStopStation.value.stationId = ''
    insertStopStation.value.arrive_time = ''
    insertStopStation.value.start_time = ''
    insertStopStation.value.speed = ''
    //关闭编辑状态
    isEdit.value = false
  }

  //确认删除线路站点
  function enSureDeleteStation(){
    //查询站点id，进行删除
    for (let index = 0; index < StopList.value.length; index++) {
      if(StopList.value[index].id == insertStopStation.value.id){
        StopList.value.splice(index,1)
      }
    }
    isEdit.value = false
  }

  //查询站点id
  function getStationId(stationName){
    //查询站点名，返回站点id
    for (let index = 0; index < props.lineList.length; index++) {
      if(props.lineList[index].station == stationName){
        return props.lineList[index].id
      }
    }
  }

  

  onMounted(() => {
    //console.log('3.-组件挂载到页面之后执行-------onMounted')
  })
</script> 
<template>
  <div>
    <el-dialog v-model="_dialogInfo.isShow" title="本线经停管理" width="1000" top="5vh" @close="closeDialog" @open="openDialog">
      <el-table :data="StopList" height="500" @row-click="editStopStation"> 
        <el-table-column type="index" prop="index" label="站序" width="80" align="center"/>
        <el-table-column prop="station_name" label="站名" align="center" />
        <el-table-column prop="line" label="所属线路" align="center" />
        <el-table-column prop="arrive_time" label="到达时刻" align="center">
          <template v-slot="{ row }">
            <!-- 在这里进行格式化 -->
            {{ formatTime(row.arrive_time) }}
          </template>
        </el-table-column>
        <el-table-column prop="start_time" label="出发时刻" align="center">
          <template v-slot="{ row }">
            <!-- 在这里进行格式化 -->
            {{ formatTime(row.start_time) }}
          </template>
        </el-table-column>
        <el-table-column prop="stopover_time" label="停车时间" align="center"/>
        <el-table-column prop="speed" label="时速" align="center">
          <template v-slot="{ row }">
            <!-- 在这里进行格式化 -->
            {{ row.speed }}KM/h
          </template>
        </el-table-column>
      </el-table>
      <!-- <MRwatermark class="floatWatermark"/> -->
      <div style="margin-top:5%">
        <el-descriptions class="margin-top" :column="4" size="small" border>
          <el-descriptions-item label="站名" align="center">
            <el-select v-model="insertStopStation.station_name" clearable placeholder="选择车站" style="width:140px;outline:none;">
              <el-option
                v-for="item in props.lineList"
                :key="item.id"
                :label="item.station"
                :value="item.station"
              />
            </el-select>
          </el-descriptions-item>
          <el-descriptions-item label="到达时刻" align="center">
            <el-time-picker v-model="insertStopStation.arrive_time" style="width:120px;outline:none;"/>
          </el-descriptions-item>
          <el-descriptions-item label="出发时刻" align="center" >
            <el-time-picker v-model="insertStopStation.start_time" style="width:120px;outline:none;"/>
          </el-descriptions-item>
          <el-descriptions-item label="时速" align="center" >
            <el-input v-model="insertStopStation.speed" style="width:130px;outline:none;" maxlength="3">
              <template #append>KM/h</template>
            </el-input>
          </el-descriptions-item>
          <el-descriptions-item label="功能按钮" align="center">
            <el-button @click="enSureInsertStation" type="primary" :disabled="isEdit">确认新增</el-button>
            <el-button @click="enSureEditStation" type="warning" :disabled="!isEdit">确认修改</el-button>
            <el-button @click="enSureDeleteStation" type="danger" :disabled="!isEdit">删除站点</el-button>
            <el-button @click="isEdit=false" type="info" :disabled="!isEdit">取消编辑</el-button>
          </el-descriptions-item>
        </el-descriptions>
      </div>
      <!-- 弹窗的提示栏 -->
      <div class="tipsBox">
        <el-tag type="success" class="tips">Tips: 按键盘Tab键可以快速切换字段,站名框按回车上下选择,时间可以按左右键切换时刻</el-tag>
        &nbsp;
        <el-tag type="primary" class="tips">Tips: 点击表格中的站点可以切换编辑模式</el-tag>
      </div>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
//置于顶层水印
.floatWatermark{
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 20;
  // 控制事件的传递，可以穿透上层水印到下层操作dom
  pointer-events: none;
}
</style>