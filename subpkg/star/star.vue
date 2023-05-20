<template>
  <view>
    <view class="page-top">
      <!-- 顶部页面标题 -->
      <view class="top-title">
        <view class=""></view>

        <view class="top-title-center">
          我的收藏
          <text>({{ starCount }})</text>
        </view>

        <view class="top-title-right">
          <uni-icons type="search" size="18"></uni-icons>
          <text>管理</text>
        </view>
      </view>

      <!-- 顶部导航 -->
      <view class="nav-bar">
        <view class="nav-bar-item" v-for="(item, index) in navList" :key="index" @click="changeNav(index)">
          <text :class="isactive === index ? 'active' : ''">{{ navList[index] }}</text>
        </view>
      </view>
    </view>

    <!-- 页面内容 -->
    <view class="page-content"><my-star :activeNav="isactive"></my-star></view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      // 收藏商品数量
      starCount: 0,
      // 当前活动项
      isactive: 0,
      // 导航栏
      navList: ['宝贝', '图文', '视频', '话题', '清单']
    };
  },

  methods: {
    // 改变活动项
    changeNav(index) {
      this.isactive = index;
    }
  }
};
</script>

<style lang="scss">
.page-top {
  height: 65px;
  background-color: #eeeeef;
  padding: 10px;

  .top-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    letter-spacing: 1px;
    font-size: 16px;
    height: 20px;
    margin-bottom: 5px;

    .top-title-center {
      margin-right: -50px;
      font-weight: bolder;

      text {
        font-size: 12px;
      }
    }

    .top-title-right {
      font-size: 14px;

      text {
        margin-left: 5px;
      }
    }
  }

  .nav-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 35px;
    font-size: 14px;

    .active {
      font-size: 16px;
      font-weight: bold;
      color: #ff5500;
      letter-spacing: 2px;
    }
  }
}
</style>
