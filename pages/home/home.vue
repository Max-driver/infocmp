<template>
  <view>
    <!-- 搜索框 -->
    <view class="search-box"><my-search @goSearch="gotoSearch"></my-search></view>
    <!-- 轮播图 -->
    <swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
      <!-- 轮播图 iten 项 -->
      <swiper-item v-for="(item, index) in swiperList" :key="index">
        <navigator class="swiper-item" :url="'/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id">
          <!-- 动态获取图片src -->
          <image :src="item.image_src"></image>
        </navigator>
      </swiper-item>
    </swiper>

    <!-- 分类导航栏 -->
    <view class="nav-list">
      <view class="nav-item" v-for="(item, index) in navList" :key="index" @click="navClickHandler(item)"><image :src="item.image_src" class="nav-img"></image></view>
    </view>

    <!-- 楼层区 -->
    <view class="floor-list">
      <!-- item 项 -->
      <view class="floor-item" v-for="(item, index) in floorList" :key="index">
        <!-- 楼层标题 -->
        <image :src="item.floor_title.image_src" class="floor-title"></image>
        <!-- 楼层图片区 -->
        <view class="floor-img-box">
          <!-- 左 -->
          <navigator class="left-img-box" :url="item.product_list[0].url">
            <image :src="item.product_list[0].image_src" :style="{ width: item.product_list[0].image_width + 'rpx' }" mode="widthFix"></image>
          </navigator>
          <!-- 右 -->
          <view class="right-img-box">
            <navigator class="floor-img-item" v-for="(item2, index2) in item.product_list" :key="index2" v-if="index2 !== 0" :url="item2.url">
              <image :src="item2.image_src" mode="widthFix" :style="{ width: item2.image_width + 'rpx' }"></image>
            </navigator>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
// 导入自己封装的 mixin 模块
import badgeMix from '@/mixins/tabbar-badge.js';

export default {
  // 将 badgeMix 混入到当前的页面中进行使用
  mixins: [badgeMix],

  data() {
    return {
      // 1. 这是轮播图数据
      swiperList: [],
      // 分类导航数据
      navList: [],
      // 楼层区域数据
      floorList: []
    };
  },

  onLoad() {
    // 2. 在小程序页面刚加载的时候，调用获取轮播图数据的方法
    this.getSwiperList();
    this.getNavList();
    this.getFloorList();
  },

  methods: {
    // 3. 获取轮播图数据的方法
    async getSwiperList() {
      // 3.1 发起请求
      const { data: res } = await uni.$http.get('/api/public/v1/home/swiperdata');
      // 3.2 请求失败
      if (res.meta.status !== 200) {
        return uni.showToast();
      }
      // 3.3 请求成功，为 data 中的数据赋值
      this.swiperList = res.message;
    },
    // 获取分类导航数据
    async getNavList() {
      const { data: res } = await uni.$http.get('/api/public/v1/home/catitems');
      if (res.meta.status !== 200) return uni.$showMsg();
      this.navList = res.message;
    },
    // 点击切换分类页面
    navClickHandler(item) {
      if (item.name === '分类') {
        uni.switchTab({
          url: '/pages/cate/cate'
        });
      }
    },
    // 获取楼层数据
    async getFloorList() {
      const { data: res } = await uni.$http.get('/api/public/v1/home/floordata');
      if (res.meta.status !== 200) return uni.$showMsg();
      // 处理后台跳转的 URL 地址
      res.message.forEach(floor => {
        floor.product_list.forEach(prod => {
          prod.url = '/subpkg/goods_list/goods_list?' + prod.navigator_url.split('?')[1];
        });
      });
      this.floorList = res.message;
    },
    // 跳转搜索页面
    gotoSearch() {
      uni.navigateTo({
        url: '/subpkg/search/search'
      });
    }
  }
};
</script>

<style lang="scss">
// 轮播图
swiper {
  height: 330rpx;
  .swiper-item,
  image {
    width: 100%;
    height: 100%;
  }
}

// 导航栏
.nav-list {
  display: flex;
  justify-content: space-around;
  margin: 15px 0;

  .nav-img {
    width: 128rpx;
    height: 140rpx;
  }
}

// 楼层区
.floor-list {
  // 标题
  .floor-title {
    height: 60rpx;
    width: 100%;
    display: flex;
  }
  // 图片
  .floor-img-box {
    display: flex;
    padding-left: 10rpx;
  }
  .right-img-box {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
  }
}

// 搜索框吸顶
.search-box {
  // 设置定位效果为“吸顶”
  position: sticky;
  // 吸顶的“位置”
  top: 0;
  // 提高层级，防止被轮播图覆盖
  z-index: 999;
}
</style>
