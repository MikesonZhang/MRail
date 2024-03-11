<script setup>
import { ref } from 'vue'
import ticketSelectBox from "../../components/indexPage/ticketSelectBox.vue"
import travelCard from "../../components/indexPage/travelCard.vue"
import noticeBox from "../../components/indexPage/noticeBox.vue"

const imgSrc = [
  "https://www.12306.cn/index/images/pic/banner20201223.jpg",
  "https://www.12306.cn/index/images/pic/banner20200707.jpg",
  "https://www.12306.cn/index/images/pic/banner0619.jpg",
  "https://www.12306.cn/index/images/pic/banner26.jpg"
]
const travelInfo = ref([
  {
    travelDestination:"成都",
    travelPrice:199.00,
    travelImgUrl:"https://pic4.40017.cn/poi/2016/04/05/15/IWa6NU_242x150_00.jpg.webp",
    travelUrl:'测试Url'
  },
  {
    travelDestination:"上海",
    travelPrice:999.00,
    travelImgUrl:"https://pic4.40017.cn/poi/2016/07/19/13/KmgXXM_242x150_00.jpg.webp",
    travelUrl:'测试Url'
  },
  {
    travelDestination:"三亚",
    travelPrice:7999.00,
    travelImgUrl:"https://pic4.40017.cn/poi/2016/07/19/20/uX9ZWC_242x150_00.jpg.webp",
    travelUrl:'测试Url'
  },
  {
    travelDestination:"乌鲁木齐",
    travelPrice:2999.00,
    travelImgUrl:"https://pic4.40017.cn/poi/2016/03/15/17/j0rfcf_242x150_00.jpg.webp",
    travelUrl:'测试Url'
  },
  {
    travelDestination:"贵阳",
    travelPrice:199.00,
    travelImgUrl:"https://pic3.40017.cn/poi/2016/01/26/19/bGKO8E_242x150_00.jpg.webp",
    travelUrl:'测试Url'
  },
  {
    travelDestination:"兰州",
    travelPrice:199.00,
    travelImgUrl:"https://pic3.40017.cn/poi/2016/03/07/14/sswvoA_242x150_00.jpg.webp",
    travelUrl:'测试Url'
  },
  {
    travelDestination:"丽江",
    travelPrice:199.00,
    travelImgUrl:"https://pic3.40017.cn/poi/2016/03/07/14/IMv3uL_242x150_00.jpg.webp",
    travelUrl:'测试Url'
  },
  {
    travelDestination:"北京",
    travelPrice:199.00,
    travelImgUrl:"https://pic4.40017.cn/poi/2016/05/04/16/HKRh3S_242x150_00.jpg.webp",
    travelUrl:'测试Url'
  },
])
</script>
<template>
  <div class="mainBox">
    <!-- 轮播box -->
    <div class="carousel-container">
      <ticket-select-box class="ticketBox"/>
      <!-- 轮播图 -->
      <el-carousel indicator-position="outside" :interval="4000" height="400px">
        <el-carousel-item v-for="item in imgSrc" :key="item">
          <img :src="item" class="carouselImg"/>
        </el-carousel-item>
      </el-carousel>
    </div>
    <!-- 广告box -->
    <div>
      <div class="advertisementBox">
        <img src="https://www.12306.cn/index/images/abanner01.jpg" class="adPhoto"/>
        <img src="https://www.12306.cn/index/images/abanner02.jpg" class="adPhoto"/>
        <img src="https://www.12306.cn/index/images/abanner06.jpg" class="adPhoto"/>
        <img src="https://www.12306.cn/index/images/abanner05.jpg" class="adPhoto"/>
      </div>
    </div>
    <!-- 旅游box -->
    <div>
      <div class="travelLineBox">
        <template v-for="(item,index) in travelInfo" :key="index">
          <travel-card class="travelCard" :info="item"/>
        </template>
      </div>
    </div>
    <div>
      <notice-box class="noticeBox"/>
    </div>
  </div>
</template>

<style scoped lang="scss">
.mainBox {
  margin: 0;
  padding: 0;
  height: 90vh;
  width: 100%;
  background-color: white;
}
.el-carousel__item h3 {
  display: flex;
  color: #475669;
  opacity: 0.75;
  line-height: 300px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}

.carouselImg{
  width: 100%; /* 设置图片宽度为容器宽度 */
  height: 100%; /* 设置图片高度为容器高度 */
  object-fit: cover; /* 将图片等比例放大以填充容器，可能会裁剪部分图片 */
}

.carousel-container {
  position: relative;
}

.ticketBox{
  position: absolute;
  width: 500px;
  height: 350px;
  top: 5%; /* 调整垂直位置 */
  left: 5%; /* 调整水平位置 */
  z-index: 2; /* 设置堆叠顺序，确保 ticketBox 在上层 */
}

// 4X广告盒子
.advertisementBox{
  display: flex;
  align-content: center;
  justify-content: center;
  .adPhoto{
    width: 400px;
    height: 100px;
    margin: 5px;
  }
}
// 旅游盒子行布局
.travelLineBox{
  display: flex;
  flex-wrap: wrap;
}
// 旅游盒子布局
.travelCard{
  flex-basis:10%;
  flex-grow:1;// 分别表示flex-grow, flex-shrink, flex-basis的值
  margin: 10px;
  height: 150px;
  border-radius: 5px;
}
// 公告盒子
.noticeBox{
  margin-top: 20px;
  height: 300px;
  width: 100%;
  //margin-left: 2%;
}

</style>