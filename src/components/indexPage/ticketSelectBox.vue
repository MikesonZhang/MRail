<!-- 车站查询按钮的盒子 -->
<script setup>
import { ref } from "vue";
import { Location,ArrowLeft,ArrowRight } from '@element-plus/icons-vue'
import router from "../../routers/index"

import { searchStationAPI } from '../../apis/station'
import { useStationStore } from '../../stores/stationPinia'
import debounce from 'lodash/debounce' // 只引入需要的工具函数 ==> 打包文件变小了




const activeMode = ref('oneWay')

// 选择车票的出发日期
const startTimeDate = ref('')

// 查询的数据是否为学生/高铁/12306数据
const isStudent = ref(false)
const isHighTrain = ref(false)
const isData12306 = ref(true)
//搜索站点关键字

const startStationInfo = ref({})
const endStationInfo = ref({})
const startStationKey = ref('')
const endStationKey = ref('')

// 站点列表
const stationList = ref(
  {
    list:[],
    currentPage:1,
    itemsPerPage:4
  }
)

// 站点搜索框分页切割
function paginatedList() {
  const startIndex = (stationList.value.currentPage - 1) * stationList.value.itemsPerPage
  const endIndex = startIndex + stationList.value.itemsPerPage
  return stationList.value.list.slice(startIndex, endIndex)
}
// 计算可以有多少页
function totalPages() {
  return Math.ceil(stationList.value.list.length / stationList.value.itemsPerPage);
}
// 上一页
function prevPage() {
  if (stationList.value.currentPage > 1) {
    stationList.value.currentPage--;
  }
}
// 下一页
function nextPage() {
  if (stationList.value.currentPage < totalPages()) {
    stationList.value.currentPage++;
  }
}

const startDisplay = ref('none')
const endDisplay = ref('none')

// 防抖操作的 searchStation 函数
const debouncedSearchStation = debounce(async function(type) {
  // searchStation 的内容保持不变
  if (type == 'start') {
    // 结果框显示
    startDisplay.value = 'block';
    // 搜索请求发起
    if (startStationKey.value != '' && isData12306.value) {
      stationList.value.list = [];
      const res = await searchStationAPI(startStationKey);
      stationList.value.currentPage = 1;
      stationList.value.list = res.data;
    }
  } else if (type == 'end') {
    // 结果框显示
    endDisplay.value = 'block';
    // 搜索请求发起
    if (endStationKey.value != '' && isData12306.value) {
      stationList.value.list = [];
      const res = await searchStationAPI(endStationKey);
      stationList.value.currentPage = 1;
      stationList.value.list = res.data;
    }
  }
}, 500); // 这里的500表示防抖延迟的时间，单位是毫秒
// 查询车站执行的函数
async function searchStation(type){
  debouncedSearchStation(type);
}
// 关闭所有的搜索站点框
function closeSearchDownDiv(){
  startDisplay.value = 'none'
  endDisplay.value = 'none'
  document.getElementById('StationDiv').blur();
}
//选择车站
function chooseStation(type,item){
  if(type=='start'){
    startStationKey.value = item.station_chinese
    startStationInfo.value = item
    //startStationInfo.value = 
    startDisplay.value = 'none'
  }else if(type='end'){
    endStationKey.value = item.station_chinese
    endStationInfo.value = item
    endDisplay.value = 'none'
  }
}

// 跳转到查询详情页
function searchToListButton(){

  // pinia存储操作
  const station = useStationStore()
  station.startStationInfo = startStationInfo.value;
  station.endStationInfo = endStationInfo.value;
  station.startTimeDate = formatDate(startTimeDate.value);

  router.push({ 
    path: `/ticketsPage/&fs=${startStationKey.value}&ts=${endStationKey.value}&date=${formatDate(startTimeDate.value)}&student=${isStudent.value}&highTrain=${isHighTrain.value}&is12306=${isData12306.value}`
  });
}

// 日期处理函数
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始，所以需要加1，并且确保两位数格式
  const day = String(date.getDate()).padStart(2, '0'); // 确保两位数格式

  return `${year}-${month}-${day}`;
}

// 限制只能选择今天及以后的日期
const disabledDate = (time) => {
  return time.getTime() < Date.now() - 8.64e7
}

</script>
<template>
  <div class="mainBox">
    <el-tabs :stretch="true" tab-position="left" class="ticket-tabs" type="card">
      <el-tab-pane label="车票">
        <template #label>
          <span class="custom-tabs-label">
            <el-icon><Tickets /></el-icon>&nbsp;
            <span>车票</span>
          </span>
        </template>
        <!-- 车票下属选项卡 -->
        <el-tabs v-model="activeMode" class="ticket-tabs-second">
          <el-tab-pane label="单程" name="oneWay" class="ticket-tabs-second-card">
            <template #label>
              <span class="custom-tabs-label">
                <el-icon><DArrowRight /></el-icon>&nbsp;
                <span>单程</span>
              </span>
            </template>
            <div class="formItemBox">
              <div style="flex:1;" class="formItemTitle">
                出发地
              </div>
              <div style="flex:4;" id="StationDiv" @mouseleave="closeSearchDownDiv()">
                <el-input v-model="startStationKey" placeholder="成都东" @input="searchStation('start')"/>
                <!-- 出发站的下拉框 -->
                <div class="StationDownDiv" :style="{display:startDisplay}">
                  <div class="StationDownDivTitle">
                    <div style="flex:1">按"{{startStationKey}}"检索: </div>
                    <div style="flex:1">
                      <el-button :icon="ArrowLeft" circle @click="prevPage" :disabled="stationList.currentPage === 1" size="small"/>
                      &nbsp;
                      <span>第{{stationList.currentPage}}页</span>
                      &nbsp;
                      <el-button :icon="ArrowRight" circle @click="nextPage" :disabled="stationList.currentPage === totalPages()" size="small"/>
                    </div>
                  </div>
                  <div>
                    <ul v-for="(item,index) in paginatedList()" :key="index" class="StationDownDivList">
                      <li class="StationDownDivListItem" @click="chooseStation('start',item)">
                        <div style="flex:2">{{item.station_chinese}}</div>
                        <div style="flex:1"></div>
                        <div style="flex:2;text-align:left">{{item.station_pinyin}}</div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            <br/>
            <div class="formItemBox">
              <div style="flex:1;" class="formItemTitle">
                到达地
              </div>
              <div style="flex:4;" id="endStationDiv" @mouseleave="closeSearchDownDiv()">
                <el-input v-model="endStationKey" placeholder="沙坪坝" @input="searchStation('end')" />
                <!-- 出发站的下拉框 -->
                <div class="StationDownDiv" :style="{display:endDisplay}">
                  <div class="StationDownDivTitle">
                    <div style="flex:1">按"{{endStationKey}}"检索: </div>
                    <div style="flex:1">
                      <el-button :icon="ArrowLeft" circle @click="prevPage" :disabled="stationList.currentPage === 1" size="small"/>
                      &nbsp;
                      <span>第{{stationList.currentPage}}页</span>
                      &nbsp;
                      <el-button :icon="ArrowRight" circle @click="nextPage" :disabled="stationList.currentPage === totalPages()" size="small"/>
                    </div>
                  </div>
                  <div>
                    <ul v-for="(item,index) in paginatedList()" :key="index" class="StationDownDivList">
                      <li class="StationDownDivListItem" @click="chooseStation('end',item)">
                        <div style="flex:2">{{item.station_chinese}}</div>
                        <div style="flex:1"></div>
                        <div style="flex:2;text-align:left">{{item.station_pinyin}}</div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <br/>
            <div class="formItemBox">
              <div style="flex:1;" class="formItemTitle">
                出发日期
              </div>
              <div style="flex:4;">
                <el-date-picker
                  v-model="startTimeDate"
                  type="date"
                  placeholder="选择出发日期"
                  style="width:290px"
                  :disabled-date="disabledDate"
                />
              </div>
            </div>
            <br/>
            <div class="formItemBox">
              <div style="flex:1;"></div>
              <div style="flex:3;">
                <el-checkbox v-model="isStudent">学生</el-checkbox>
              </div>
              <div style="flex:3;">
                <el-checkbox v-model="isHighTrain">高铁/动车</el-checkbox>
              </div>
              <div style="flex:3;">
                <el-checkbox v-model="isData12306">12306数据</el-checkbox>
              </div>
              <div style="flex:1;"></div>
            </div>
            <br/>
            <div class="formItemBox">
              <div style="flex:1;">
                <el-button class="searchButton" @click="searchToListButton()">查询</el-button>
              </div>
            </div>

          </el-tab-pane>
          <!-- 暂时不开发 -->
          <el-tab-pane label="往返" name="returnWay" class="ticket-tabs-second-card">
            <template #label>
              <span class="custom-tabs-label">
                <el-icon><Sort /></el-icon>&nbsp;
                <span>往返</span>
              </span>
            </template>
            暂时没有开发计划
          </el-tab-pane>
          <el-tab-pane label="中转" name="transferWay" class="ticket-tabs-second-card">
            <template #label>
              <span class="custom-tabs-label">
                <el-icon><Rank /></el-icon>&nbsp;
                <span>中转</span>
              </span>
            </template>
            暂时没有开发计划
          </el-tab-pane>
        </el-tabs>
      </el-tab-pane>
      <!-- 暂时不开发 -->
      <el-tab-pane label="查询">
        <template #label>
          <span class="custom-tabs-label">
            <el-icon><Search /></el-icon>&nbsp;
            <span>查询</span>
          </span>
        </template>
        暂时没有开发计划
      </el-tab-pane>
      <el-tab-pane label="订餐">
        <template #label>
          <span class="custom-tabs-label">
            <el-icon><CircleCheck /></el-icon>&nbsp;
            <span>订餐</span>
          </span>
        </template>
        暂时没有开发计划
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style scoped lang="scss">
.mainBox{
  background-color: white;
}
/* 一级标签卡 */
.ticket-tabs{
  height: 100%;
}
/* 一级标签卡重写样式 */
.el-tabs {
  --el-tabs-header-height: 115px;
  overflow: hidden;
}
:deep(.el-tabs__item.is-left){
  background-image: url("/background/bg01.png");
  color: white;
}
:deep(.el-tabs__item.is-active){
  background-image: url("/background/bg02.png");
  color: red;
}
/* 二级标签卡 */
.ticket-tabs-second{
  width: 90%;
  height: 100%;
  margin: 5%;
}
:deep(.el-tabs__item.is-top){
  height: 50px;
}
:deep(.el-tabs__active-bar){
  background-color:red
}
:deep(.el-tabs__item:hover){
  color: red;
}
/* 表单自定义样式 */
.formItemBox{
  display:flex;
  justify-content: center;
  align-content: center;
}
.formItemTitle{
  text-align:center;
  line-height:30px;
}
/* 多选框自定义样式 */
:deep(.el-checkbox){
  --el-checkbox-checked-text-color: red;
  --el-checkbox-checked-input-border-color: red;
  --el-checkbox-checked-bg-color: red;
  --el-checkbox-input-border-color-hover:red;
}
/* 查询按钮自定义样式 */
.searchButton{
  background-image: url("/background/search.png");
  background-size: cover;
  color: white;
  width: 100%;
  letter-spacing: 20px;
}
:deep(.el-button){
  --el-button-hover-text-color: white;
  --el-button-hover-border-color: red;
  --el-button-hover-bg-color: red;
}

/* 车站form */
#StationDiv{
  position: relative;
}
/* 车站下拉 */
.StationDownDiv{
  width: 290px;
  height: 200px;
  left: 0;
  top: 100%;
  background-color: white;
  position: absolute;
  z-index: 100;
  display: block;
  .StationDownDivTitle{
    width: 90%;
    height: 20%;
    text-align: left;
    justify-content: center;
    align-content: center;
    line-height: 40px;
    color: grey;
    border-bottom:1px solid rgb(155, 155, 155);
    margin-left: 5%;
    margin-right: 5%;
    display: flex;
  }
  .StationDownDivList{
    padding: 0;    //去掉默认内边距，也就是ul标签左边的内边距40px
    margin: 0;
    width: 90%;
    position: relative;
    left: 5%;
    margin-top: 1%;
    .StationDownDivListItem{
      height: 28px;
      color: grey;
      list-style:none;
      margin: 0;
      display: flex;
      text-overflow: ellipsis;
      word-break: break-all;
      white-space: nowrap;
    }
    .StationDownDivListItem:hover{
      background-color: rgb(232,243,255);
      color: rgb(98,160,252);
    }
  }
}

// 结束车站form
#endStationDiv{
  position: relative;
}

</style>