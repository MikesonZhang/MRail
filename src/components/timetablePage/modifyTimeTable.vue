<!-- 自定义时刻表页面 -->
<script setup>
  import { ref,reactive } from 'vue';
  import timetableEcharts from './timetableEcharts.vue'
  import MRwatermark from '../../components/common/MRwatermark.vue'
  import modifyTimeTableStopSelection from "./modifyTimeTableStopSelection.vue"
  import { useShowDialogVisible } from '../../stores/showDialog'

  import { ElLoading } from 'element-plus'
  import { v4 as uuidv4 } from 'uuid';
  import { colorfulJudge } from '../../scripts/timeTableAssist'
  import { ElMessage } from 'element-plus'

  const props = defineProps(['timeTableStyle']);

  //图表xy轴刻度(站点列表)
  const config = ref([])
  //echarts图表ref元素
  const timeTable = ref(null)

  //确认生成时刻表
  const ensureGenerateTimeTable = ref(false)
  //生成时刻表加载判断
  const fullscreenLoading = ref(false)
  //激活的面板
  const activeNames = ref('1')

  //激活的车站
  const activeStation = ref({
    stationName:'',
    belongingLine:'',
    kilometerNumber:'',
    trainNumberList:[]
  })
  //路线管理抽屉
  let lineDrawerVisible = ref(false)
  //新建路线的新增站点
  const insertStation = ref({
    id:null,
    station: '',
    kilometer: '',
    type:'info',
    line:'',
  })
  //预制线路名
  const presetLineName = ref('新建线路')
  //新增与修改的判断
  const isEdit = ref(false)

  //车次管理抽屉
  let carDrawerVisible = ref(false)

  //车次列表
  const trainList = ref([])

  //插入的列车信息
  const insertTrain = ref({
    id:null,
    number: '',
    destinationStation: '',
    departureStation:'',
    trainType:'G',
    site:[]
  })
  
  //新增车次的本线经停站弹窗
  let stopSelectionVisible = reactive({
    isShow: false
  })
  //新增车次的本线经停站的更新事件,获取从子组件过来的停站数据
  const handleUpdateStopSelection = (data) => {
    insertTrain.value.site = data
  };
 



  //------------------------------全局函数

  //鼠标点击站点上执行的函数
  function handleStationOver(item){
    activeStation.value.stationName = item.station
    activeStation.value.belongingLine = item.line
    activeStation.value.kilometerNumber = item.kilometer
  }
  //生成运行图
  function generateTimeTable(){
    ensureGenerateTimeTable.value = true
    openFullScreenLoading(3000)
  }
  //全屏加载
  const openFullScreenLoading = (time) => {
    const loading = ElLoading.service({
      lock: true,
      text: '正在生成运行图请稍后！',
      background: 'rgba(255, 255, 255, 1)',
    })
    setTimeout(() => {
      loading.close()
    }, time)
  }

  //------------------------------路线管理函数
  //确认预设线路名
  function enSurePresetLineName(){
    insertStation.value.line = presetLineName.value
  }
  //确认新增线路站点
  function enSureInsertStation(){
    const uniqueId = uuidv4();
    //Vue3如果直接push,传过去的是浅拷贝，需要按照下面进行深拷贝
    let obj = {
      id: uniqueId,
      station: insertStation.value.station,
      kilometer: insertStation.value.kilometer,
      type:insertStation.value.type,
      line:insertStation.value.line,
    }
    if(stationNameisExist(obj.station)){
      config.value.push(obj)
    }else{
      return
    }
    
    if(ensureGenerateTimeTable.value){
      //从子组件暴露出来的刷新方法
      timeTable.value.handleXYConfig()
      timeTable.value.refreshYAxis()
      openFullScreenLoading(500)
    }
    insertStation.value.station = ''
    insertStation.value.type = 'info'
    insertStation.value.kilometer = ''
  }
  //编辑站点
  function editStation(scope){
    insertStation.value.id = scope.id
    insertStation.value.station = scope.station
    insertStation.value.kilometer = scope.kilometer
    insertStation.value.line = scope.line
    insertStation.value.type = scope.type
    isEdit.value = true
  }
  //确认修改线路站点
  function enSureEditStation(){
    //Vue3如果直接push,传过去的是浅拷贝，需要按照下面进行深拷贝
    let obj = {
      id:insertStation.value.id,
      station: insertStation.value.station,
      kilometer: insertStation.value.kilometer,
      type:insertStation.value.type,
      line:insertStation.value.line,
    }

    //更新原有的站点信息
    for (let index = 0; index < config.value.length; index++) {
      if(config.value[index].id == obj.id){
        config.value[index].station = obj.station
        config.value[index].kilometer = obj.kilometer
        config.value[index].type = obj.type
        config.value[index].line = obj.line
      }
    }
    
    //进行加载图表
    if(ensureGenerateTimeTable.value){
      //从子组件暴露出来的刷新方法
      timeTable.value.handleXYConfig()
      timeTable.value.refreshYAxis()

      openFullScreenLoading(500)
    }

    //重置插入站点框
    insertStation.value.station = ''
    insertStation.value.type = 'info'
    insertStation.value.kilometer = ''
    //关闭编辑状态
    isEdit.value = false
  }
  //确认删除线路站点
  function enSureDeleteStation(){
    //查询站点id，进行删除
    for (let index = 0; index < config.value.length; index++) {
      if(config.value[index].id == insertStation.value.id){
        config.value.splice(index,1)
      }
    }
    //进行加载图表
    if(ensureGenerateTimeTable.value){
      //从子组件暴露出来的刷新方法
      timeTable.value.handleXYConfig()
      timeTable.value.refreshYAxis()

      openFullScreenLoading(500)
    }
  }
  //车站名存在判断
  function stationNameisExist(stationName){
    for (let index = 0; index < config.value.length; index++) {
      if(config.value[index].station == stationName){
        ElMessage.error('站点名不能相同，请修改！')
        return false
      }
    }
    return true
  }
  //------------------------------车次管理函数
  //确认新增车次
  function enSureInsertLine(){
    const uniqueId = uuidv4();
    //Vue3如果直接push,传过去的是浅拷贝，需要按照下面进行深拷贝
    let obj = {
      id: uniqueId,
      departureStation: insertTrain.value.departureStation,
      destinationStation: insertTrain.value.destinationStation,
      number:insertTrain.value.number,
      //这里有proxy的依赖，甩不开
      site:insertTrain.value.site,
      trainType:insertTrain.value.trainType,
    }
    // 车次号判断
    obj = formatTrainType(obj)
    if(obj!=null){
      trainList.value.push(obj)
    }else{
      return
    }
    
    //刷新图表中的车次
    if(ensureGenerateTimeTable.value){
      //从子组件暴露出来的刷新方法
      timeTable.value.handleXYConfig()
      timeTable.value.refreshYAxis()
      timeTable.value.handleTrainDataFliter()
      openFullScreenLoading(500)
    }
    
    insertTrain.value.departureStation = ''
    insertTrain.value.destinationStation = ''
    insertTrain.value.number = ''
    insertTrain.value.site = []
    insertTrain.value.trainType = 'G'
  }
  //时间格式化函数
  function formatTime(Time){
    const date = new Date(Time);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }
  //列车号格式化
  function formatTrainType(obj){
    const firstChar = obj.number.charAt(0);
    const secondChar = obj.number.charAt(1);
    if (/[a-zA-Z]/.test(firstChar)) {
      // 如果是字母，不做改变
    } else if (/[0-9]/.test(firstChar)) {
      // 如果是数字，加一个字母
      obj.number = obj.trainType +""+ obj.number;
    } 
    if(/[a-zA-Z]/.test(secondChar)){
      ElMessage.error('车次号格式输入不正确,请重新修改')
      return
    }
    return obj;
  }

  //修改车次
  function editLine(scope){
    insertTrain.value.id = scope.id
    insertTrain.value.number = scope.number
    insertTrain.value.departureStation = scope.departureStation
    insertTrain.value.destinationStation = scope.destinationStation
    insertTrain.value.trainType = scope.trainType
    insertTrain.value.site = scope.site
    isEdit.value = true
  }
  
  //确认修改车次
  function enSureEditLine(){
    //Vue3如果直接push,传过去的是浅拷贝，需要按照下面进行深拷贝
    let obj = {
      id:insertTrain.value.id,
      number: insertTrain.value.number,
      destinationStation: insertTrain.value.destinationStation,
      departureStation:insertTrain.value.departureStation,
      trainType:insertTrain.value.trainType,
    }

    //更新原有的站点信息
    for (let index = 0; index < trainList.value.length; index++) {
      if(trainList.value[index].id == obj.id){
        trainList.value[index].number = obj.number
        trainList.value[index].destinationStation = obj.destinationStation
        trainList.value[index].departureStation = obj.departureStation
        trainList.value[index].trainType = obj.trainType
      }
    }

    //刷新图表中的车次
    if(ensureGenerateTimeTable.value){
      //从子组件暴露出来的刷新方法
      timeTable.value.handleXYConfig()
      timeTable.value.refreshYAxis()
      timeTable.value.handleTrainDataFliter()
      openFullScreenLoading(500)
    }
  
    //重置插入站点框
    insertTrain.value.number = ''
    insertTrain.value.destinationStation = ''
    insertTrain.value.departureStation = ''
    insertTrain.value.trainType = ''
    insertTrain.value.site = []
    //关闭编辑状态
    isEdit.value = false
  }

  //确认删除车次
  function enSureDeleteLine(){
    //查询车次id，进行删除
    for (let index = 0; index < trainList.value.length; index++) {
      if(trainList.value[index].id == insertTrain.value.id){
        trainList.value.splice(index,1)
      }
    }
    //刷新图表中的车次
    if(ensureGenerateTimeTable.value){
      //从子组件暴露出来的刷新方法
      timeTable.value.handleXYConfig()
      timeTable.value.refreshYAxis()
      timeTable.value.handleTrainDataFliter()
      openFullScreenLoading(500)
    }
    
  }

</script>
<template>
  <div>
    <div style="display:flex;">
      <!-- 运行图子组件 -->
      <div>
        <timetable-echarts 
          :info="timeTableStyle" 
          :config="config"
          :lineName="presetLineName"
          :trainData="trainList"
          v-if="ensureGenerateTimeTable"
          ref="timeTable"
        />
        <div v-else>
          <el-tag type="success" class="tips">Tips: 数据还未生成,请点击生成图表</el-tag>
        </div>
      </div>
      <!-- 站线图 -->
      <div>
        <div class="stationLineBox" :style="'height:'+timeTableStyle.height">
          <div class="stationLineTitle">
            <el-text class="mx-1" type="primary">站线图</el-text> 
          </div>
          <el-timeline style="max-width: 600px">
            <el-timeline-item
              v-for="(item, index) in config"
              :key="index"
              :timestamp="item.kilometer+'km'"
              @click="handleStationOver(item)"
              :type="item.type"
            >
              {{ item.station }}
            </el-timeline-item>
          </el-timeline>
        </div>
      </div>
      <!-- 侧边的功能区 -->
      <div class="functionBox" :style="'height:'+timeTableStyle.height">
        <el-collapse v-model="activeNames">
          <el-collapse-item title="功能按钮" name="1">
            <div class="functionButton">
              <el-button type="primary" round @click="lineDrawerVisible = true">路线管理</el-button>
              <el-button type="success" round @click="carDrawerVisible = true">车次管理</el-button>
              <el-button type="warning" round @click="generateTimeTable">生成图表</el-button>
              <el-button type="info" round>导出图表</el-button>
            </div>
          </el-collapse-item>
          <el-collapse-item title="车站信息" name="2">
            <div>
              <el-descriptions
                class="margin-top"
                :column="3"
                size="small"
                border
              >
                <el-descriptions-item label="车站名" align="center">{{activeStation.stationName}}</el-descriptions-item>
                <el-descriptions-item label="所属线路" align="center">{{activeStation.belongingLine}}</el-descriptions-item>
                <el-descriptions-item label="公里数" align="center">{{activeStation.kilometerNumber}}</el-descriptions-item>
                <el-descriptions-item label="车次列表" label-align="center">
                  {{activeStation.trainNumberList}}
                </el-descriptions-item>
              </el-descriptions>
            </div>
          </el-collapse-item>
          <el-collapse-item title="运行图全部信息" name="3">
            <div>
              <el-descriptions
                class="margin-top"
                :column="3"
                size="small"
                border
              >
                <el-descriptions-item label="起点站" align="center" v-if="config[0]!=null">
                  {{config[0].station}}
                </el-descriptions-item>
                <el-descriptions-item label="终点站" align="center" v-if="config[0]!=null">
                  {{config[config.length-1].station}}
                </el-descriptions-item>
                <el-descriptions-item label="公里数" align="center" v-if="config[0]!=null">
                  {{config[config.length-1].kilometer}}
                </el-descriptions-item>
                <el-descriptions-item label="车次信息" :span="3" label-align="center">
                  <span v-for="(item,index) in 3" :key="index">
                    {{index+1}}-G317 成都东-青岛<br/>
                  </span>
                </el-descriptions-item>
              </el-descriptions>
            </div>
          </el-collapse-item>
        </el-collapse>
        <div style="margin-top:1%">
          <el-tag type="success" class="tips">Tips: 请修改完线路名称再生成图表,否则导图图表会使用默认路线名称</el-tag>
        </div>
        <!-- <MRwatermark/> -->
      </div>



      <!-- 路线管理弹窗的操作区 -->
      <el-drawer v-model="lineDrawerVisible" :title="'路线管理-'+presetLineName" v-if="lineDrawerVisible" direction="rtl">
        <!-- 弹窗的表格 -->
        <el-table :data="config" height="500" @row-click="editStation">
          <el-table-column type="index" prop="index" label="站序" width="80" align="center"/>
          <el-table-column prop="station" label="站名" align="center" />
          <el-table-column prop="kilometer" label="公里数" align="center" />
          <el-table-column prop="line" label="所属线路" align="center" />
          <el-table-column prop="type" label="种类" align="center">
            <template v-slot="{ row }">
              <!-- 在这里进行格式化 -->
              <span v-if="row.type == 'primary'">线路起点</span>
              <span v-else-if="row.type == 'success'">线路终点</span>
              <span v-else-if="row.type == 'warning'">其他线路点</span>
              <span v-else></span>
            </template>
          </el-table-column>
        </el-table>
        <!-- <MRwatermark class="floatWatermark"/> -->
        <!-- 弹窗的工具栏 -->
        <div style="margin-top:5%">
          <el-descriptions
              class="margin-top"
              :column="3"
              size="small"
              border
            >
            <el-descriptions-item label="预设线路名" align="center" :span="3">
              <el-input v-model="presetLineName" style="outline:none;">
                <template #append>
                  <el-button @click="enSurePresetLineName">确认</el-button>
                </template>
              </el-input>
            </el-descriptions-item>
            <el-descriptions-item label="站名" align="center">
              <el-input v-model="insertStation.station" style="outline:none;"/>
            </el-descriptions-item>
            <el-descriptions-item label="所属线路" align="center">
              <el-input v-model="insertStation.line" style="outline:none;"/>
            </el-descriptions-item>
            <el-descriptions-item label="公里里程" align="center" >
              <el-input v-model="insertStation.kilometer" style="width:80px;outline:none;" maxlength="5"/>
            </el-descriptions-item>
            <el-descriptions-item label="站点种类" align="center" :span="3">
              <el-radio-group v-model="insertStation.type" class="ml-4">
                <el-radio value="info" size="small" label="info">普通站点</el-radio>
                <el-radio value="primary" size="small" label="primary">线路起点</el-radio>
                <el-radio value="success" size="small" label="success">线路终点</el-radio>
                <el-radio value="warning" size="small" label="warning">其他线路点</el-radio>
              </el-radio-group>
            </el-descriptions-item>
            <el-descriptions-item label="功能按钮" label-align="center">
              <el-button @click="enSureInsertStation" type="primary" :disabled="isEdit">确认新增</el-button>
              <el-button @click="enSureEditStation" type="warning" :disabled="!isEdit">确认修改</el-button>
              <el-button @click="enSureDeleteStation" type="danger" :disabled="!isEdit">删除站点</el-button>
              <el-button @click="isEdit=false" type="info" :disabled="!isEdit">取消操作</el-button>
            </el-descriptions-item>
          </el-descriptions>
        </div>
        <br/>
        <!-- 弹窗的提示栏 -->
        <div class="tipsBox">
          <el-tag type="success" class="tips">Tips: 按键盘Tab键可以快速切换</el-tag>
          &nbsp;
          <el-tag type="primary" class="tips">Tips: 点击表格中的站点可以切换编辑模式</el-tag>
        </div>
      </el-drawer>
      <el-drawer title="错误" v-else>
        <span>数据还未加载完成，请稍后!</span>
      </el-drawer>
      <!-- 车次管理弹窗的操作区 -->
      <el-drawer v-model="carDrawerVisible" title="车次管理" v-if="carDrawerVisible" direction="rtl">
        <!-- 车次表格 -->
        <el-table :data="trainList" :border="true" style="width: 100%" height="500" @row-click="editLine">
          <el-table-column type="expand">
            <template #default="props">
              <div m="4">
                <p m="t-0 b-2">本线经停:</p>
                <el-table :data="props.row.site" :border="true">
                  <el-table-column label="车站" prop="station_name" />
                  <el-table-column label="到达时刻" prop="arrive_time">
                    <template v-slot="{ row }">
                      <!-- 在这里进行格式化 -->
                      {{ formatTime(row.arrive_time) }}
                    </template>
                  </el-table-column>
                  <el-table-column label="出发时刻" prop="start_time">
                    <template v-slot="{ row }">
                      <!-- 在这里进行格式化 -->
                      {{ formatTime(row.start_time) }}
                    </template>
                  </el-table-column>
                  <el-table-column label="停车时间" prop="stopover_time" />
                  <el-table-column label="时速(预留)" prop="speed" />
                </el-table>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="车次" prop="number">
            <template v-slot="{ row }">
              <div :style="'color:'+colorfulJudge(row.trainType)">{{ row.number }}</div>
            </template>
          </el-table-column>
          <el-table-column label="始发站" prop="destinationStation" />
          <el-table-column label="终点站" prop="departureStation" />
        </el-table>
        <!-- <MRwatermark class="floatWatermark"/> -->
        <div style="margin-top:5%">
          <el-descriptions class="margin-top" :column="3" size="small" border>
            <el-descriptions-item label="车次种类" align="center" :span="3">
              <el-radio-group v-model="insertTrain.trainType" class="ml-4">
                <el-radio value="G" size="small" label="G">G</el-radio>
                <el-radio value="D" size="small" label="D">D</el-radio>
                <el-radio value="C" size="small" label="C">C</el-radio>
                <el-radio value="Z" size="small" label="Z">Z</el-radio>
                <el-radio value="T" size="small" label="T">T</el-radio>
                <el-radio value="K" size="small" label="K">K</el-radio>
                <el-radio value="S" size="small" label="S">S</el-radio>
                <el-radio value="Y" size="small" label="Y">Y</el-radio>
              </el-radio-group>
            </el-descriptions-item>
            <el-descriptions-item label="车次" align="center">
              <el-input v-model="insertTrain.number" style="outline:none;"/>
            </el-descriptions-item>
            <el-descriptions-item label="始发" align="center">
              <el-input v-model="insertTrain.destinationStation" style="width:140px;outline:none;"/>
            </el-descriptions-item>
            <el-descriptions-item label="终到" align="center">
              <el-input v-model="insertTrain.departureStation" style="width:140px;outline:none;"/>
            </el-descriptions-item>
            <el-descriptions-item label="经停管理" align="center" :span="3">
              <el-button @click="stopSelectionVisible.isShow = true" type="primary">经停管理</el-button>
            </el-descriptions-item>
            <el-descriptions-item label="功能按钮" align="center" :span="3">
              <el-button @click="enSureInsertLine" type="primary" :disabled="isEdit">确认新增</el-button>
              <el-button @click="enSureEditLine" type="warning" :disabled="!isEdit">确认修改</el-button>
              <el-button @click="enSureDeleteLine" type="danger" :disabled="!isEdit">删除车次</el-button>
              <el-button @click="isEdit=false" type="info" :disabled="!isEdit">取消操作</el-button>
            </el-descriptions-item>
          </el-descriptions>
        </div>
      </el-drawer>
      <el-drawer title="错误" v-else>
        <span>数据还未加载完成，请稍后!</span>
      </el-drawer>

      <!-- 车次停靠弹窗组件 -->
      <modifyTimeTableStopSelection :lineList="config" :StopSelectionVisible="stopSelectionVisible" :site="insertTrain.site" @updateStopSelection="handleUpdateStopSelection"/>

    </div>
  </div>
</template>

<style scoped lang="scss">
// 功能盒子
.functionBox{
  margin-left: 2%;
  width: 100%;
  overflow-y: scroll;
  .functionButton{
    width: 100%;
    height: 5%;
    display: flex;
    place-items: center;
    margin-top: 1%;
    margin-bottom: 0%;
  }
  .stationInfoBox{
    margin-top: 2%;
    margin-bottom: 2%;
  }
  .allInfoBox{
    width: 100%;
  }
}
// 站线盒子
.stationLineBox{
  width: 180px;
  overflow-y: scroll;
  .stationLineTitle{
    text-align: center;
    margin-bottom: 5%;
  }
}
:deep(.el-drawer__title){
  font-size: 18px;
  font-weight: 500;
}

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