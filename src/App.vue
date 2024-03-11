<script setup>
import { ref,nextTick,provide } from 'vue'
const isRouterAlive = ref(true)

// 局部刷新函数 
const reload = () => {
  isRouterAlive.value = false;
  nextTick(() => {
    isRouterAlive.value = true;
  });
};

provide("reload", reload);
</script>

<template>
  <div id="mainBox">
    <div id="menu">
      <h5 class="mb-2">MR铁路平台</h5>
      <el-menu
        default-active="2"
        class="el-menu-vertical-demo"
        :router="true"
      >
        <el-menu-item index="/">
          <span>平台首页</span>
        </el-menu-item>
        <el-sub-menu index="2">
          <template #title>
            <el-icon><Location /></el-icon>
            <span>铁路工具</span>
          </template>
          <el-menu-item-group title="铁路工具">
            <el-menu-item index="/schedulingRoute">图形化排图</el-menu-item>
            <el-menu-item index="/timetablePage">时刻表系统</el-menu-item>
          </el-menu-item-group>
        </el-sub-menu>
      </el-menu>
    </div>
    <div id="content">
      <router-view v-if="isRouterAlive"></router-view>
    </div>
  </div>
</template>

<style scoped>
*{
  -moz-user-select: none;
  -o-user-select:none;
  -khtml-user-select:none;
  -webkit-user-select:none;
  -ms-user-select:none;
  user-select:none;
}
#mainBox{
  /*
    filter: grayscale(30%);
  */
  margin: 0;
  padding: 0;
  width: 100%;
  display: flex;
}
#menu{
  height:100vh;
}
#content{
  width: 100%;
}


</style>
