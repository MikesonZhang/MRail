<!-- 票务详情页顶部的搜索盒子 -->
<script setup>
  import { ref } from 'vue';
  const props = defineProps(['info']);
</script>
<template>
  <div class="mainBox">
    <div class="radio">
      <div class="radio-group">
        <label><input type="radio" name="visit" value="friend" checked>单程</label>
        <label><input type="radio" name="visit" value="family" disabled>返程</label>
      </div>
    </div>
    <div class="divider"></div>
    <div class="fs">
      <div style="flex:1;" class="formItemTitle">
        出发地
      </div>
      <div style="flex:3;">
        <el-input :placeholder="info.fs"/>
      </div>
    </div>
    <div class="transform">
      <el-icon class="transformIcon"><Switch /></el-icon>
    </div>
    <div class="fs">
      <div style="flex:1;" class="formItemTitle">
        目的地
      </div>
      <div style="flex:3;">
        <el-input :placeholder="info.ts"/>
      </div>
    </div>
    <div class="fs">
      <div style="flex:1;" class="formItemTitle">
        出发日
      </div>
      <div style="flex:3;">
        <el-input :placeholder="info.date"/>
      </div>
    </div>
    <div class="divider"></div>
    <div class="radio">
      <div class="radio-group">
        <label><input type="radio" name="passager" value="friend" checked>普通</label>
        <label><input type="radio" name="passager" value="family" disabled>学生</label>
      </div>
    </div>
    <div class="searchButton">
      <el-button>查询</el-button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.mainBox {
  position: relative;
  background-color: rgb(238,241,248);
  border: 1px solid rgb(41,140,206);
  display: flex;
  align-items: center; // 垂直居中



  // 单选框
  .radio {
    margin: 10px;
    display: inline-block; // 修改成inline-block
    white-space:nowrap;
    .radio-group {
      height: 100%; // 宽度100%
      display: flex;
      flex-direction: column;
      align-items: center; // 水平居中
    }
    .radio-group label {
      margin-bottom: 5px;
    }
  }
  // 分割线
  .divider{
    background-color: rgb(41,140,206);
    width: 1px;
    height: 80%;
    margin: 10px;
  }

  // 出发地终到地
  .fs{
    flex: 1;
    display: flex;
    .formItemTitle{
      height: 20%;
      text-align: left;
      justify-content: center;
      align-content: center;
      line-height: 30px;
      color: grey;
      white-space:nowrap;
      margin-left: 10px;
      display: flex;
    }
  }
  // 转变按钮
  .transform{
    position: relative;
    margin-left: 15px;
    .transformIcon{
      left: 50%;
      display: flex;
      place-items: center;
    }
  }
  // 查询按钮
  .searchButton{
    margin: 5%;
    button{
      display: flex;
      place-items: center;
      width: 150px;
      height: 40px;
      background-color: rgb(255,128,0);
      color: white;
      white-space:nowrap;
    }
  }
}
</style>