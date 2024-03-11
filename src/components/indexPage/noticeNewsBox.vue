<!-- 公告栏下样式相同的新闻盒子，这是子组件 -->
<script setup>
  import { onMounted, ref } from 'vue';
  const props = defineProps({
    info: {
    type: Array,
    default: []
    },
    type: {
      type: String,
      default: 'default'
    }
  })
  const list = ref([])
  // 是否加载完毕
  const requestFlag = ref(false)

  function openNewPage(url){
    window.open(url, '_blank');
  }

  onMounted(()=>{
    if(props.info.length != 0){
      requestFlag.value = true
    }
  })
</script>
<template>
  <div class="mainBox" v-if="requestFlag">

      <div class="aRowNewsBox">
        <ul v-for="(item,index) in info.slice(0, 5)" :key="index">
          <li class="aNewsListItem" @click="openNewPage(item.src)">
            <span class="leftSpan">{{item.title}}</span>
            <span class="rightSpan">{{item.date}}</span>
          </li>
        </ul>
      </div>
      <div class="aRowNewsBox">
        <ul v-for="(item,index) in info.slice(5, 10)" :key="index">
          <li class="aNewsListItem" @click="openNewPage(item.src)">
            <span class="leftSpan">{{item.title}}</span>
            <span class="rightSpan">{{item.date}}</span>
          </li>
        </ul>
        <span class="moreButton">更多>></span>
      </div>

  </div>
  <div class="mainBox" v-else>
    数据还未加载完成,请耐心等待！
  </div>
</template>

<style scoped lang="scss">
.mainBox{
  display: flex;
  width: 100%;
  .aRowNewsBox{
    flex: 1;
    position: relative;
    .moreButton{
      position: absolute;
      left: 90%;
      color: grey;
    }
  }
}
.aNewsListItem{
  list-style-type: square;
  font-size: 14px;
  height: 30px;
  position: relative;
  justify-content: space-between;
  &::marker{
    color: red;
  }
  .rightSpan{
    position: absolute;
    left: 85%;
    text-align: right;
    color: grey;
  }
}

</style>