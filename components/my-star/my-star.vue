<template>
  <view>
    <view class="star-content">
      <view class="goods-nav" v-if="activeNav == 0">{{ activeNav }}</view>
      <view class="picture-nav" v-else-if="activeNav == 1">{{ activeNav }}</view>
      <view class="video-nav" v-else-if="activeNav == 2">{{ activeNav }}</view>
      <view class="topic-nav" v-else-if="activeNav == 3">{{ activeNav }}</view>
      <view class="inventory-nav" v-else="activeNav == 4">{{ activeNav }}</view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'my-star',
  // 活动的页面数据
  props: ['activeNav'],
  data() {
    return {};
  }
};
</script>

<style lang="scss">
.star-content {
  position: relative;
  top: -5px;
  height: calc(100vh - 80px);
  overflow: hidden;
  background-color: pink;
}
</style>
