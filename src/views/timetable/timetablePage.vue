<!-- 这里是时刻表系统的主页 -->
<script setup>
  import { ref } from 'vue';
  import timetableEcharts from '../../components/timetablePage/timetableEcharts.vue'
  import modifyTimeTable from '../../components/timetablePage/modifyTimeTable.vue'
  //图表长宽
  const activeName = ref('first')
  const timeTableStyle = ref({
    width:'50vw',//70vw为最宽不超出,50vw最佳
    height:'80vh' 
  })
</script>
<template>
  <div class="mainBox">
    <el-tabs
      v-model="activeName"
      type="border-card"
      class="demo-tabs"
    >
      <el-tab-pane label="自定义运行图" name="first">
        <modify-time-table :timeTableStyle="timeTableStyle"/>
      </el-tab-pane>
      <el-tab-pane label="12306运行图" name="second">Config</el-tab-pane>
      <el-tab-pane label="Role" name="third">Role</el-tab-pane>
      <el-tab-pane label="Task" name="fourth">Task</el-tab-pane>
    </el-tabs>
    
  </div>
</template>

<style scoped lang="scss">
.mainBox{
  overflow-x: hidden;
  height: 98vh;
}

</style>