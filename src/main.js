import { createApp } from 'vue'
import App from './App.vue'
import router from './routers/index';
import pinia from './stores/index.js'; // 导入 Pinia 实例

import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
pinia.use(piniaPluginPersistedstate)

//import elementPlusConfig from './configs/elementPlusImportConfig';
import 'element-plus/dist/index.css'
// 如果您正在使用CDN引入，请删除下面一行。
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import axios from "axios"; // 安装axios后引入
axios.defaults.withCredentials = true;

//引入防抖
import debounce from 'lodash/debounce';

import echarts from './configs/echartsImportConfig';



import AMapLoader from '@amap/amap-jsapi-loader';
window._AMapSecurityConfig = {
  securityJsCode: "05f4eb735b1afeddce10dfd3fb572a0a",
};
AMapLoader.load({
  key: '9691f84d3fecb4553e47a69aa9f9f637', //设置您的key
  version: '2.0',
  plugins: [
    'AMap.ToolBar', 
    'AMap.Driving', 
    'AMap.DragRoute',
    'AMap.PolygonEditor',
    'AMap.Scale',
    'AMap.ToolBar',
    'AMap.MapType',
    'AMap.Driving',
    'AMap.MouseTool'
  ],
  AMapUI: {
    version: '1.1',
    plugins: [],
  },
  Loca: {
    version: '2.0',
  },         // 需要使用的的插件列表，如比例尺'AMap.Scale'等，更多插件请看官方文档
}).then((AMap) => {
  // createApp(App).use(AMap).mount('#app')
  /* eslint-disable no-new */
  const app = createApp(App);
  app.config.globalProperties.$axios = axios; // 将axios挂载到原型上方便使用
  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }
  // 对全局resize和滚动条的滚动进行防抖
  app.config.globalProperties.$debouncedResize = debounce(function () {}, 500);
  app.config.globalProperties.$debouncedScroll = debounce(function () {}, 500);
  // 将echarts挂载到Vue实例的原型链上
  app.config.globalProperties.$echarts = echarts;
  app.use(router);
  app.use(pinia);
  //app.use(elementPlusConfig)

  app.mount('#app');
  window.addEventListener('resize', app.config.globalProperties.$debouncedResize);
  window.addEventListener('scroll', app.config.globalProperties.$debouncedScroll);
})



