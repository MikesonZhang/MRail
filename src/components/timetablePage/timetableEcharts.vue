<!-- echarts运行图组件 -->
<template>
  <div ref="chart" :style="'width: '+info.width+'; height: '+info.height+';'" class="chart"></div>
  <el-button @click="refresh()">重置</el-button>
</template>

<script setup>
  import { ref, onMounted, getCurrentInstance,inject, reactive } from 'vue';
  import { colorfulJudge } from '../../scripts/timeTableAssist'
  const props = defineProps(['info','config','lineName','trainData']);
  const chart = ref(null);
  let chartInstance = null
  // 清洗过的echarts series数据
  let trainList = reactive([])

  //坐标Y轴信息
  let lineInfo = ref({
    kilometers:[],
    stations:[]
  })

  //初始化时刻表
  function initTimeTable() {
    

    const endLabel = {
      show:true,
      formatter: '{@[2]}',
      distance: 30,
      rotate:0,
      fontWeight:'bold',
      backgroundColor:colorfulJudge('G'),
      color:'white',
      borderWidth:20,
      borderType:'dashed',
      height:15,
      width:50,
      verticalAlign:'middle',
    }

    const options = {
      title: {
        text: 'MR铁路平台自定义运行图-' + props.lineName,
        textStyle:{
          fontSize:12
        },
      },
      grid: {
        top: '10%',
        containLabel: true,
        left: '5%',
        width:'90%',
        height:'75%',
        containLabel: true,// 网格包括坐标轴标签的空间
        borderWidth: 1,
        borderColor: '#ccc',
        show: true,
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        },
        formatter: function (params) {
          var tooltip = params[0].axisValue+'全天车次信息<br/>';
          params.forEach(function (item) {
            var time = new Date(item.value[0]);
            var station = item.value[1];
            var vehicle = item.value[2] || '';
            tooltip += time.toLocaleTimeString() + ' ' + station + ' ' + vehicle + '<br>';
          });
          return tooltip;
        }
      },
      toolbox: {
        show: true,
        orient: "horizontal",
        left: "left",
        top: "bottom",
        feature: {
          //保存为图片
          saveAsImage: { 
            show: true,
            name: 'MR铁路平台自定义运行图-'+props.lineName,
            title: '保存为图片'
          },  // 保存图表
        },
      },
      xAxis: [
        {
          show: true,
          type: 'time', // 设置 x 轴为时间类型
          boundaryGap: false, // 不留白，从原点开始
          axisLabel: {
            formatter: function (value) {
              const date = new Date(value);
              const hours = ('0' + date.getHours()).slice(-2);
              const minutes = ('0' + date.getMinutes()).slice(-2);
              return hours + ':' + minutes; // 自定义 x 轴标签格式
            },
            interval: 0 // 强制显示所有刻度
          },
          axisTick: {
            interval: 0 // 强制显示所有刻度
          },
          position: 'top',
          nameTextStyle:{
            align:'center'
          },
          axisLine:{
            onZero:false
          },
          offset:50,
          splitLine: { // 添加网格线
            show: true,
            lineStyle: {
                type: 'dashed', // 设置网格线为虚线
                color: '#aaa' // 设置网格线颜色为灰色
            }
          }
        }
      ],
      yAxis: {
        type: 'category',
        nameTextStyle:{
          fontWeight:'bold',
        },
        offset:10,
        inverse:true,
        data: lineInfo.value.stations,
        axisLabel: {
        formatter: function (value, index) {
            // 假设每个站点之间距离为100公里，公里数从0开始
            var kilometer = lineInfo.value.kilometers[index];
            return value + '  ' + kilometer;
          }
        },
        boundaryGap: false, // 不留白，从原点开始
        silent:false,
        splitLine: { // 添加网格线
          show: true,
          lineStyle: {
              type: 'dashed', // 设置网格线为虚线
              color: '#aaa' // 设置网格线颜色为灰色
          }
        }
      },
      //自定义水印
      // graphic:MRwatermark(),
      //series:trainList,
      series: [
        {
          data: [],
          type: 'line',
          lineStyle: {
            color: colorfulJudge('G')
          },
          symbol: 'none', // 取消设置点
          endLabel:endLabel,
          emphasis: {
            focus: 'series',
          },
        },
      ],
    };
    chartInstance.setOption(options);
  }

  //水印处理
  function MRwatermark(){
    let graphic = []
    
    for (let i = 0; i < 30; i++) {
      for (let j = 0; j < 30; j++) {
        let temp = {
          type: 'text',
          silent:true,
          rotation: Math.PI / 5, // 旋转角度，这里是45度
          z: 10,
          left: 100+i*150, //控制y
          top: 50+j*100, //控制x
          style: {
            fill: '#cccccc80',   //颜色ffffff白色，不透明度80%
            text: ['MR铁路平台'].join(''),
            fontSize:15
          }
        }
        graphic.push(temp)
      }
    }
    return graphic
  }

  // 局部刷新函数
  const refresh = inject("reload")

  //处理传过来的config参数
  function handleXYConfig(){
    // info置空
    lineInfo.value.kilometers = []
    lineInfo.value.stations = []
    for (let index = 0; index < props.config.length; index++) {
      lineInfo.value.kilometers.push(props.config[index].kilometer)
      lineInfo.value.stations.push(props.config[index].station)
    }
  }

  //销毁整个图表，重新新建Y轴
  function refreshYAxis(){

    const newOption = {
      xAxis: [
        {
          show: true,
          type: 'time', // 设置 x 轴为时间类型
          boundaryGap: false, // 不留白，从原点开始
          axisLabel: {
            formatter: function (value) {
              const date = new Date(value);
              const hours = ('0' + date.getHours()).slice(-2);
              const minutes = ('0' + date.getMinutes()).slice(-2);
              return hours + ':' + minutes; // 自定义 x 轴标签格式
            },
            interval: 0 // 强制显示所有刻度
          },
          axisTick: {
            interval: 0 // 强制显示所有刻度
          },
          position: 'top',
          nameTextStyle:{
            align:'center'
          },
          axisLine:{
            onZero:false
          },
          offset:50,
          splitLine: { // 添加网格线
            show: true,
            lineStyle: {
                type: 'dashed', // 设置网格线为虚线
                color: '#aaa' // 设置网格线颜色为灰色
            }
          }
        }
      ],
      yAxis: {
        type: 'category',
        nameTextStyle:{
          fontWeight:'bold',
        },
        offset:10,
        inverse:true,
        data: lineInfo.value.stations,
        axisLabel: {
        formatter: function (value, index) {
            // 假设每个站点之间距离为100公里，公里数从0开始
            var kilometer = lineInfo.value.kilometers[index];
            return value + '  ' + kilometer;
          }
        },
        boundaryGap: false, // 不留白，从原点开始
        silent:false,
        splitLine: { // 添加网格线
          show: true,
          lineStyle: {
              type: 'dashed', // 设置网格线为虚线
              color: '#aaa' // 设置网格线颜色为灰色
          }
        }
      },
      // graphic:MRwatermark(),
    };
    // 如果是true那就是重新新建，默认false
    chartInstance.setOption(newOption,false);
  }

  //车次信息处理函数
  function handleTrainDataFliter(){
    if(props.trainData.length!=0){
      const options = {
        title: {
          text: 'MR铁路平台自定义运行图-' + props.lineName,
          textStyle:{
            fontSize:12
          },
        },
        grid: {
          top: '10%',
          containLabel: true,
          left: '5%',
          width:'90%',
          height:'75%',
          containLabel: true,// 网格包括坐标轴标签的空间
          borderWidth: 1,
          borderColor: '#ccc',
          show: true,
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          formatter: function (params) {
            var tooltip = params[0].axisValue+'全天车次信息<br/>';
            params.forEach(function (item) {
              var time = new Date(item.value[0]);
              var station = item.value[1];
              var vehicle = item.value[2] || '';
              tooltip += time.toLocaleTimeString() + ' ' + station + ' ' + vehicle + '<br>';
            });
            return tooltip;
          }
        },
        toolbox: {
          show: true,
          orient: "horizontal",
          left: "left",
          top: "bottom",
          feature: {
            //保存为图片
            saveAsImage: { 
              show: true,
              name: 'MR铁路平台自定义运行图-'+props.lineName,
              title: '保存为图片'
            },  // 保存图表
          },
        },
        xAxis: [
          {
            show: true,
            type: 'time', // 设置 x 轴为时间类型
            boundaryGap: false, // 不留白，从原点开始
            axisLabel: {
              formatter: function (value) {
                const date = new Date(value);
                const hours = ('0' + date.getHours()).slice(-2);
                const minutes = ('0' + date.getMinutes()).slice(-2);
                return hours + ':' + minutes; // 自定义 x 轴标签格式
              },
              interval: 0 // 强制显示所有刻度
            },
            axisTick: {
              interval: 0 // 强制显示所有刻度
            },
            position: 'top',
            nameTextStyle:{
              align:'center'
            },
            axisLine:{
              onZero:false
            },
            offset:50,
            splitLine: { // 添加网格线
              show: true,
              lineStyle: {
                  type: 'dashed', // 设置网格线为虚线
                  color: '#aaa' // 设置网格线颜色为灰色
              }
            }
          }
        ],
        yAxis: {
          type: 'category',
          nameTextStyle:{
            fontWeight:'bold',
          },
          offset:10,
          inverse:true,
          data: lineInfo.value.stations,
          axisLabel: {
          formatter: function (value, index) {
              // 假设每个站点之间距离为100公里，公里数从0开始
              var kilometer = lineInfo.value.kilometers[index];
              return value + '  ' + kilometer;
            }
          },
          boundaryGap: false, // 不留白，从原点开始
          silent:false,
          splitLine: { // 添加网格线
            show: true,
            lineStyle: {
                type: 'dashed', // 设置网格线为虚线
                color: '#aaa' // 设置网格线颜色为灰色
            }
          }
        },
        //自定义水印
        // graphic:MRwatermark(),
        //series:trainList,
        series: [],
      };

      for (let index = 0; index < props.trainData.length; index++) {
        const endLabelTemp = {
          show:true,
          formatter: '{@[2]}',
          distance: 30,
          rotate:0,
          fontWeight:'bold',
          backgroundColor:colorfulJudge(props.trainData[index].trainType),
          color:'white',
          borderWidth:20,
          borderType:'dashed',
          height:15,
          width:50,
          verticalAlign:'middle',
        }

        let temp = {
          data: [],
          type: 'line',
          lineStyle: {
            color: colorfulJudge(props.trainData[index].trainType),
          },
          symbol: 'none', // 取消设置点
          endLabel: endLabelTemp,
          emphasis: {
            focus: 'series',
          },
        }
        // 添加数据(到达时间与出发时间)
        let judge = 0;
        for (let j = 0; j < props.trainData[index].site.length; ) {
          let innerArray = []
          if(judge == 0){
            //到达时间
            innerArray.push(new Date(formatTime(props.trainData[index].site[j].arrive_time)))
            innerArray.push(props.trainData[index].site[j].station_name)
            innerArray.push(props.trainData[index].number)
            temp.data.push(innerArray)
            judge = 1;
          }else{
            //出发时间
            innerArray.push(new Date(formatTime(props.trainData[index].site[j].start_time)))
            innerArray.push(props.trainData[index].site[j].station_name)
            innerArray.push(props.trainData[index].number)
            temp.data.push(innerArray)
            judge = 0;
            j++;
          }
        }
        options.series.push(temp)
      }
      chartInstance.setOption(options,true);
    }
  }

  //时间格式化函数
  function formatTime(Time){
    const dateObject = new Date(Time);
    const year = dateObject.getFullYear();
    const month = String(dateObject.getMonth() + 1).padStart(2, '0'); // 月份从 0 开始，需要加 1
    const day = String(dateObject.getDate()).padStart(2, '0');
    const hours = String(dateObject.getHours()).padStart(2, '0');
    const minutes = String(dateObject.getMinutes()).padStart(2, '0');

    // 格式化为新的日期时间字符串
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }



  onMounted(() => {
    const _this = getCurrentInstance().appContext.config.globalProperties;
    chartInstance = _this.$echarts.init(chart.value);
    handleXYConfig();
    initTimeTable();
    handleTrainDataFliter();
  });

  //把方法暴露,可以让父组件进行手动刷新图表
  defineExpose({
    handleXYConfig,
    refreshYAxis,
    handleTrainDataFliter
  });
</script>

<style scoped lang="scss">
.chart{
  border: 1px solid grey;
}
.mrwatermark{
  position: absolutes;
}
</style>