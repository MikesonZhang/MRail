<!-- 旅行盒子，存放每一个景点的信息 -->
<script setup>
import { ref } from 'vue';
const props = defineProps(['info']);
const infoUrl = ref(props.info.travelImgUrl)

</script>
<template>
  <div class="bgBox" :style="{'background-image':'url('+infoUrl+')'}">
    {{ info.travelDestination }}
    <div class="priceBox">&nbsp;￥:{{ info.travelPrice }}/人</div>
  </div>
</template>

<style scoped lang="scss">
.bgBox{
  display: grid;
  place-items: center;
  line-height: 100%;
  text-align: center;
  font-size: 36px;
  font-family: '幼圆';
  position: relative;
  color: white;
  .priceBox{
    position: absolute;
    display: flex;
    place-items: center;
    width: 100%;
    height: 20%;
    top: 80%;
    text-align: left;
    font-size: 20px;
    font-family: '宋体';
    background-color: rgb(219,64,41);
    color: white;
    opacity: 0.9;
    border-radius: 0px 0px 5px 5px;
  }
  position: relative;
}
.bgBox::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  border: 1px solid transparent;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  transition: transform 1s ease-in-out, box-shadow 1s ease-in-out;
}

.bgBox:hover::before {
  transform: rotate(360deg);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.8);
}

.bgBox {
  text-align: left;
  font-family: '幼圆';
  font-size: 36px; /* 初始字体大小 */
  transition: font-size 1s ease-in-out; /* 添加字体大小变化的过渡效果 */
}

.bgBox:hover {
  font-size: 46px; /* 鼠标悬停时的字体大小 */
  animation: enlargeText 1s ease-in-out forwards; /* 应用文本逐步变大的动画效果 */
}

.bgBox:not(:hover) {
  font-size: 46px; /* 鼠标未悬停时的字体大小 */
  animation: shrinkText 1s ease-in-out forwards; /* 应用文本逐步变小的动画效果 */
}

@keyframes enlargeText {
  0% {
    font-size: 36px; /* 初始字体大小 */
  }
  100% {
    font-size: 46px; /* 最终字体大小 */
  }
}

@keyframes shrinkText {
  0% {
    font-size: 46px; /* 初始字体大小 */
  }
  100% {
    font-size: 36px; /* 最终字体大小 */
  }
}

</style>