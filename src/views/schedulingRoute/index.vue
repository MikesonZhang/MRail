<script setup>

import AMapLoader from "@amap/amap-jsapi-loader";
import { onMounted, onUnmounted } from "vue";
import { ref } from "vue";

import { storeToRefs } from "pinia";
import { mapStore } from "@/stores/mapPinia";

//海量地图类
import MassiveMapPoint from "../../scripts/massiveMapPoints";

// 在pinia中拿到高德Key
let mapInfoStore = mapStore();
let { key } = storeToRefs(mapInfoStore);

import { ElMessage } from "element-plus";

let map = null;

let mapJson = ref({});

let labelsLayer = ref(null);
let labelMarker = ref([]);

window._AMapSecurityConfig = {
  securityJsCode: "05f4eb735b1afeddce10dfd3fb572a0a",
};
// 地图加载函数
const mapLoad = () => {
  
  map = new AMap.Map("schedulingRoute", {
    viewMode: "2D",
    zoom: 15,
    zooms: [2, 22],
    mapStyle: 'amap://styles/e408a6cbc70f85e6d8935385a1a70706',
    center: [106.5457095644264, 29.548817127512454],
  });
};

//Json上传函数
const handleFileChange = async (event) => {
  const file = event.target.files[0];
  if (!file) {
    console.error("未选择文件");
    return;
  }
  const content = await readFileAsync(file);
  try {
    // 将JSON字符串解析为JavaScript对象
    const jsonObject = JSON.parse(content);
    mapJson.value = jsonObject;
    ElMessage("JSON文件上传成功");
  } catch (error) {
    console.error("解析JSON时出错:", error);
  }
  //设置地图中心
  setMapCenter();
};
//Json上传异步函数
const readFileAsync = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      resolve(event.target.result);
    };
    reader.onerror = (error) => {
      reject(error);
    };
    reader.readAsText(file);
  });
};

// 设置地图中心
const setMapCenter = () => {
  console.log(mapJson.value.features.length);
  for (const feature of mapJson.value.features) {
    if(feature.properties.preview_type=="station"){
      map.setCenter(feature.geometry.coordinates,true,3000)
      ElMessage({
        showClose: true,
        message: '地图定位成功！',
        type: 'success',
      })
      break;
    }
  }
  initOneObject();
};
//
const initOneObject = () =>{
  const icon = {
    type: "image", // 图标类型，现阶段只支持 image 类型
    image:"https://transportation-test.oss-cn-chengdu.aliyuncs.com/station.png", // 图片 OSS url
    size: [70, 30], // 图片尺寸
    anchor: "center", // 图片相对 position 的锚点，默认为 bottom-center
  };
  //图层
  labelsLayer = new AMap.LabelsLayer({
    zooms: [3, 20],
    zIndex: 1000,
    collision: true, //该层内标注是否避让
    allowCollision: true, //不同标注层之间是否避让  
  });
  for(let index = 2; index < mapJson.value.features.length; index++){
    const text = {
      content: mapJson.value.features[index].properties.name+mapJson.value.features[index].properties.id, // 要展示的车站名称
      direction: "right", // 文字方向，有 icon 时为围绕文字的方向，没有 icon 时，则为相对 position 的位置
      offset: [-30, -5], // 在 direction 基础上的偏移量
      style: {
        // 文字样式
        fontSize: 12, // 字体大小
        fillColor: "#22886f", // 字体颜色
        strokeColor: "#fff", // 描边颜色
        strokeWidth: 2, // 描边宽度
      },
    };
    const data = {
      id:mapJson.value.features[index].properties.id
    }
    //标记
    const tempPoint = new AMap.LabelMarker({
      name: mapJson.value.features[index].properties.name, //此属性非绘制文字内容，仅为标识使用
      position: [mapJson.value.features[index].geometry.coordinates[0],mapJson.value.features[index].geometry.coordinates[1]],
      zIndex: 16,
      rank: 1, //避让优先级
      icon: icon, //标注图标，将 icon 对象传给 icon 属性
      text: text, //标注文本，将 text 对象传给 text 属性
      extData: data
    });
    labelsLayer.add(tempPoint);
  }
  map.add(labelsLayer);
}


onMounted(() => {
  mapLoad();
});

onUnmounted(() => {
  map?.destroy();
});
</script>
<template>
  <div style="overflow-x: hidden">
    <div style="display: flex; align-items: center; height: 5vh">
      &nbsp;&nbsp;&nbsp;&nbsp;
      <div class="custom-file-upload">
        <label for="fileInput" class="custom-button">上传JSON文件</label>
        <input
          type="file"
          id="fileInput"
          accept=".json"
          @change="handleFileChange($event)"
        />
      </div>
    </div>
    <div id="schedulingRoute"></div>
  </div>
</template>

<style scoped>
#schedulingRoute {
  padding: 0px;
  margin: 0px;
  width: 100%;
  height: 780px;
}

/* 上传按钮 */
/* 样式可以根据需要进行调整 */
.custom-file-upload {
  display: inline-block;
  position: relative;
  overflow: hidden;
}

.custom-file-upload input[type="file"] {
  position: absolute;
  font-size: 100px;
  right: 0;
  top: 0;
  opacity: 0;
}

.custom-button {
  /* Element UI 按钮样式，可根据需要进行调整 */
  display: inline-block;
  padding: 12px 20px;
  font-size: 14px;
  cursor: pointer;
  border: 1px solid #409eff;
  background-color: #409eff;
  color: #fff;
  border-radius: 4px;
}
</style>