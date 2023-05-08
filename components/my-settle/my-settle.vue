<template>
  <view>
    <view class="my-settle-container">
      <!-- 全选区域 -->
      <label class="radio">
        <radio color="#C00000" :checked="true" />
        <text>全选</text>
      </label>

      <!-- 合计区域 -->
      <view class="amount-box">
        合计：
        <text class="amount">￥xxx</text>
      </view>

      <!-- 结算按钮 -->
      <view class="btn-settle">结算:(x)</view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'my-settle',
  data() {
    return {};
  }
};
</script>

<style lang="scss">
.my-settle-container {
  /* 底部固定定位 */
  position: fixed;
  bottom: 0;
  left: 0;
  /* 设置宽高和背景色 */
  width: 100%;
  height: 50px;
  background-color: cyan;
}
</style>
