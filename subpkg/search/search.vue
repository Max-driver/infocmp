<template>
  <view>
    <!-- 使用 uni-ui 提供的搜索组件 -->
    <view class="search-box"><uni-search-bar @input="getInput" :radius="100" cancelButton="none"></uni-search-bar></view>

    <!-- 搜索建议列表 -->
    <view class="sugg-list" v-if="searchResults.length !== 0">
      <view class="sugg-item" v-for="(item, index) in searchResults" :key="index" @click="gotoDetail(item.goods_id)">
        <view class="goods-name">{{ item.goods_name }}</view>
        <uni-icons type="arrowright" size="16"></uni-icons>
      </view>
    </view>

    <!-- 搜索历史 -->
    <view class="history-box" v-else>
      <!-- 标题区 -->
      <view class="history-title">
        <text>搜索历史</text>
        <!-- 清除图标 -->
        <uni-icons type="trash" size="17" @click="cleanHistory"></uni-icons>
      </view>
      <!-- 列表区 -->
      <view class="history-list">
        <!-- uni-tag 组件 -->
        <uni-tag :text="item" v-for="(item, index) in historys" :key="index" @click="gotoGoodsList(item)"></uni-tag>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      // 延时器
      timer: null,
      // 搜索关键词
      kw: '',
      // 搜索的结果
      searchResults: [],
      // 历史记录
      historyList: []
    };
  },
  onLoad() {
    // 加载本地存储的历史记录
    this.historyList = JSON.parse(uni.getStorageSync('kw') || '[]');
  },
  computed: {
    // 反转历史记录顺序
    historys() {
      // 由于数组是引用类型，所以不要直接基于原数组调用 reverse 方法，以免修改原数组中元素的顺序
      return [...this.historyList].reverse();
    }
  },
  methods: {
    // 获取最新内容
    getInput(e) {
      // 清除 timer 对应的延时器
      clearTimeout(this.timer);
      // 重新启动一个延时器，并把 timerId 赋值给 this.timer
      this.timer = setTimeout(() => {
        // 如果 500 毫秒内，没有触发新的输入事件，则为搜索关键词赋值
        this.kw = e.trim();
        // 根据 kw 来发起搜索请求
        this.getSearchList();
      }, 500);
    },
    // 根据搜索关键词，搜索商品建议列表
    async getSearchList() {
      //先判断 kw 是否为空
      if (this.kw === '') {
        this.searchResults = [];
        return;
      }
      //不为空则发起请求
      const { data: res } = await uni.$http.get('/api/public/v1/goods/qsearch', { query: this.kw });
      if (res.meta.status !== 200) return uni.$showMsg();
      this.searchResults = res.message;
      //保存历史记录
      this.saveSearchHistory();
    },
    gotoDetail(goods_id) {
      uni.navigateTo({
        // 指定详情页面的 URL 地址，并传递 goods_id 参数
        url: '/subpkg/goods_detail/goods_detail?goods_id=' + goods_id
      });
    },
    // 保存搜索关键词为历史记录
    saveSearchHistory() {
      // this.historyList.push(this.kw);

      // 解决重复的记录
      // 1. 将 Array 数组转化为 Set 对象
      const set = new Set(this.historyList);
      // 2. 调用 Set 对象的 delete 方法，移除对应的元素
      set.delete(this.kw);
      // 3. 调用 Set 对象的 add 方法，向 Set 中添加元素
      set.add(this.kw);
      // 4. 将 Set 对象转化为 Array 数组
      this.historyList = Array.from(set);
      // 调用 uni.setStorageSync(key, value) 将搜索历史记录持久化存储到本地
      uni.setStorageSync('kw', JSON.stringify(this.historyList));
    },
    // 清空历史记录及本地历史记录
    cleanHistory() {
      this.historyList = [];
      uni.setStorageSync('kw', '[]');
    },
    // 点击跳转到商品列表页面
    gotoGoodsList(kw) {
      uni.navigateTo({
        url: '/subpkg/goods_list/goods_list?query=' + kw
      });
    }
  }
};
</script>

<style lang="scss">
// 搜索框吸顶
.search-box {
  position: sticky;
  top: 0;
  z-index: 999;
}
//搜索建议列表
.sugg-list {
  padding: 0 5px;

  .sugg-item {
    font-size: 14px;
    padding: 13px 0;
    border-bottom: 1px solid #efefef;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .goods-name {
      // 文字不允许换行（单行文本）
      white-space: nowrap;
      // 溢出部分隐藏
      overflow: hidden;
      // 文本溢出后，使用 ... 代替
      text-overflow: ellipsis;
      margin-right: 3px;
    }
  }
}

// 搜索历史
.history-box {
  padding: 0 5px;

  .history-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 40px;
    font-size: 13px;
    border-bottom: 1px solid #efefef;
  }

  .history-list {
    display: flex;
    flex-wrap: wrap;

    .uni-tag {
      margin-top: 5px;
      margin-right: 5px;
    }
  }
}
</style>
