<!-- 公告盒子与noticeNewsBox配合使用，这是父组件 -->
<script setup>
  import { onMounted, ref } from 'vue';
  import noticeNewsBox from '../indexPage/noticeNewsBox.vue'
  import { getNewsFrom12306API } from '../../apis/news'

  const activeName = ref('news12306')
  const newsInfo = ref([])
  // 是否加载完毕
  const requestFlag = ref(false)

  async function getNewsFrom12306(){
    const res = await getNewsFrom12306API()
    newsInfo.value = res.data.data.index_news_list
    requestFlag.value = true
  }
  onMounted(async ()=>{
    await getNewsFrom12306()
  })

</script>
<template>
  <div>
    <el-tabs
      v-model="activeName"
      type="card"
      class="demo-tabs"
    >
    <el-tab-pane label="12306公告" name="news12306">
      <template v-if="requestFlag">
        <notice-news-box class="noticeNewsBox" :info="newsInfo" :type="'12306'"/>
      </template>
      <template v-else>
        数据还未加载完成,请耐心等待！
      </template>
    </el-tab-pane>
    <el-tab-pane label="站内公告" name="internal">
      <notice-news-box class="noticeNewsBox"/>
    </el-tab-pane>
    <el-tab-pane label="其他信息" name="other">
      <notice-news-box class="noticeNewsBox"/>
    </el-tab-pane>
  </el-tabs>
  </div>
</template>

<style scoped lang="scss">

/* 一级标签卡重写样式 */
.el-tabs {
  --el-tabs-header-height: 35px;
  overflow: hidden;
}
:deep(.el-tabs__item.is-left){
  background-image: url("/background/bg01.png");
  color: white;
}
:deep(.el-tabs__item.is-active){
  background-image: url("/background/tit.png");
  color: white;
}
:deep(.el-tabs__item:hover){
  color: white;
}

// 新闻盒子布局
.noticeNewsBox{
  width: 100%;
  height: 280px;
}
</style>