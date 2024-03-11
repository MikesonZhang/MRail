<script setup>
  import { ref, reactive } from 'vue';

  const font = reactive({
    color: 'rgba(0, 0, 0, .15)',
  })
</script>
<template>
  <div>
    <el-watermark :font="font" :content="['MR铁路平台']">
      <div style="height: 500px" />
    </el-watermark>
  </div>
</template>

<style scoped lang="scss">
//置于顶层水印 在父组件使用，不在这里使用
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