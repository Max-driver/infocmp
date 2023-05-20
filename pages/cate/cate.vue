<template>
  <view>
    <!-- 自定义搜索组件 -->
    <my-search @goSearch="gotoSearch"></my-search>
    <view class="scroll-view-container">
      <!-- 左侧的滚动视图区域 -->
      <scroll-view class="left-scroll-view" scroll-y :style="{ height: wh + 'px' }">
        <!-- DOTO 这里为什么用 block -->
        <block v-for="(item, index) in cateList" :key="index">
          <view :class="['left-scroll-view-item', index === active ? 'active' : '']" @click="activeChanged(index)">{{ item.cat_name }}</view>
        </block>
      </scroll-view>
      <!-- 右侧的滚动视图区域 -->
      <scroll-view class="right-scroll-view" scroll-y :style="{ height: wh + 'px' }" :scroll-top="scrollTop">
        <!-- 动态渲染二级分类的列表数据 -->
        <view class="cate-lv2" v-for="(item2, index2) in cateList2" :key="index2">
          <view class="cate-lv2-title">/{{ item2.cat_name }}/</view>
          <!-- 动态渲染三级分类的列表数据 -->
          <view class="cate-lv3-list">
            <view class="cate-lv3-item" v-for="(item3, index3) in item2.children" :key="index3" @click="gotoGoodsList(item3)">
              <!-- 图片 -->
              <image :src="item3.cat_icon"></image>
              <!-- 文本 -->
              <text>{{ item3.cat_name }}</text>
            </view>
          </view>
        </view>
      </scroll-view>
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
      // 窗口的可用高度 = 屏幕高度 - navigationBar高度 - tabBar 高度- my-search高度
      wh: 0,
      // 分类数据列表
      cateList: [],
      // 选中项，当前项的索引，默认选择第一项
      active: 0,
      // 右侧二级分类列表
      cateList2: [],
      // 滚动条距离顶部的距离
      scrollTop: 0
    };
  },

  onLoad() {
    // 获取当前系统的信息
    const sysInfo = uni.getSystemInfoSync();
    // 为 wh 窗口可用高度动态赋值，可用高度 = 屏幕高度 - navigationBar高度 - tabBar高度 - 自定义的search组件高度
    this.wh = sysInfo.windowHeight - 50;
    this.getCateList();
  },

  methods: {
    // 获取左侧列表数据
    async getCateList() {
      //发起请求
      const { data: res } = await uni.$http.get('/api/public/v1/categories');
      //判断请求是否失败
      if (res.meta.status !== 200) return uni.$showMsg;
      this.cateList = res.message;
      // 因为默认左侧的一级目录选中第一项，所以默认右侧二级也是第一项数据
      this.cateList2 = res.message[0].children;
    },

    // 改变选择项,同时修改二级列表数据
    activeChanged(index) {
      this.active = index;
      // 为二级分类列表重新赋值
      this.cateList2 = this.cateList[index].children;
      // 让 scrollTop 值在 0 或 1 进行变化，达到切换后仍然置顶的效果
      this.scrollTop = this.scrollTop === 0 ? 0.1 : 0;
    },

    gotoGoodsList(item3) {
      uni.navigateTo({
        url: '/subpkg/goods_list/goods_list?cid=' + item3.cat_id
      });
    },

    // 跳转搜索框页面
    gotoSearch() {
      // 跳转到分包的搜索页面
      uni.navigateTo({
        url: '/subpkg/search/search'
      });
    }
  }
};
</script>

<style lang="scss">
.scroll-view-container {
  display: flex;
  // 左侧样式
  .left-scroll-view {
    width: 120px;

    .left-scroll-view-item {
      line-height: 60px;
      background-color: #f7f7f7;
      text-align: center;
      font-size: 12px;

      // 激活项样式, & 是 scss 的属性选择器表示包含父类和当前类名的标签
      &.active {
        background-color: #ffffff;
        position: relative;

        // 渲染激活项左侧的红线
        &::before {
          content: '';
          display: block;
          width: 3px;
          height: 30px;
          background-color: #c00000;
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
        }
      }
    }
  }
  // 右侧样式
  .right-scroll-view {
    // 二级样式
    .cate-lv2-title {
      font-size: 12px;
      font-weight: bold;
      text-align: center;
      padding: 15px, 0;
    }
    //三级样式
    .cate-lv3-list {
      display: flex;
      flex-wrap: wrap;

      .cate-lv3-item {
        width: 33.33%;
        margin-bottom: 10px;
        display: flex;
        flex-direction: column;
        align-items: center;

        image {
          width: 60px;
          height: 60px;
        }

        text {
          font-size: 12px;
        }
      }
    }
  }
}
</style>
