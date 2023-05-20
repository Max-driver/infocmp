<template>
  <view>
    <!-- 使用 uni-ui 提供的搜索组件 -->
    <view class="search-box"><uni-search-bar @confirm="searchEvent" @input="getInput" :radius="100" cancelButton="none"></uni-search-bar></view>

    <!-- 搜索建议列表 -->
    <view class="sugg-list" v-if="searchResults.length !== 0">
      <view class="sugg-item" v-for="(item, index) in searchResults" :key="index" @click="gotoDetail(item.goods_id)">
        <view class="goods-name">{{ item.goods_name }}</view>
        <uni-icons type="arrowright" size="16"></uni-icons>
      </view>
    </view>

    <view class="search-button-box" v-else>
      <!-- 搜索历史 -->
      <view class="history-box">
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

      <!-- 猜你想搜 -->
      <view class="guess-box">
        <!-- 标题 -->
        <view class="guess-title">
          <text class="guess-title-left">猜你想搜</text>
          <view class="guess-title-rigth">
            <uni-icons type="loop" size="17" class="guess-icon-left" @click="changeGuess"></uni-icons>
            <view></view>
            <uni-icons type="eye" size="17" class="guess-icon-right" @click="hiddenGuess" v-if="!hiddenEye"></uni-icons>
            <uni-icons type="eye-slash" size="17" class="guess-icon-right" @click="hiddenGuess" v-else></uni-icons>
          </view>
        </view>

        <!-- 列表 -->
        <view class="guess-list" v-if="!hiddenEye">
          <view class="guess-item" v-for="(item, index2) in guessList" :key="index2" @click="gotoGoodsList(item)">
            <text>{{ item }}</text>
          </view>
        </view>
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
      kw: null,
      // 搜索的结果
      searchResults: [],
      // 历史记录
      historyList: [],
      // 搜索猜想
      guessList: [],
      allGuessList: [],
      // 隐藏猜想列表
      hiddenEye: false
    };
  },

  onLoad() {
    // 加载本地存储的历史记录
    this.historyList = JSON.parse(uni.getStorageSync('kw') || '[]');

    // 获取搜索猜想数据
    this.getGuessList();
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
        // 如果 1000 毫秒内，没有触发新的输入事件则发起搜索请求
        this.getSearchList(e.trim());
      }, 1000);
    },

    // 根据搜索关键词，搜索商品建议列表
    async getSearchList(e) {
      // 先判断搜索是否为空
      if (e === '') {
        this.searchResults = [];
        return;
      }
      //不为空则发起请求
      const { data: res } = await uni.$http.get('/api/public/v1/goods/qsearch', { query: e });
      if (res.meta.status !== 200) return uni.$showMsg();
      this.searchResults = res.message;
    },

    searchEvent(res) {
      if (!res.value) return;
      this.kw = res.value.trim();
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
      // 解决重复的记录
      // 1. 将 Array 数组转化为 Set 对象
      const set = new Set(this.historyList);
      // 2. 调用 Set 对象的 delete 方法，移除对应的元素
      set.delete(this.kw);
      // 3. 调用 Set 对象的 add 方法，向 Set 中添加元素会自动去重
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
    },

    // 获取猜想数据
    async getGuessList() {
      const { data: res } = await uni.$http.get('/api/public/v1/categories');
      if (res.meta.status !== 200) return uni.$showMsg();

      // 将返回的数据进行处理
      let list = [];
      res.message.map(value => value.children).forEach((value, index) => list.push(...value));
      list = list.map(value => value.cat_name);
      this.allGuessList = list;
      this.changeGuess();
    },

    // 更换搜索猜想数据
    changeGuess() {
      this.guessList = this.getRandomArr(this.allGuessList, 8);
    },

    // 随机获取 n 个数据
    getRandomArr(arr, n) {
      // 生成包含原始数组索引的新数组
      const indexArr = arr.map((val, index) => index);
      // 随机排序新数组的索引
      const shuffledIndex = indexArr.sort(() => Math.random() - 0.5);
      // 根据随机排列后的结果，从原始数组中提取出对应的元素
      const resArr = shuffledIndex.slice(0, n).map(index => arr[index]);
      return resArr;
    },

    // 隐藏搜索猜想数据
    hiddenGuess() {
      let newHiddenList = this.hiddenEye;
      this.hiddenEye = !newHiddenList;
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
.history-box,
.guess-box {
  padding: 0 5px;

  .history-title,
  .guess-title {
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
    padding: 5px;

    .uni-tag {
      display: inline-block;
      color: #242424;
      margin-bottom: 8px;
      margin-right: 8px;
      border-radius: 12px;
    }
  }

  .guess-title-rigth {
    display: flex;
    align-items: center;

    view {
      // display: inline-block;
      margin-left: 11px;
      height: 13px;
      width: 10px;
      border-left: 1px solid #7d7d7d;
    }
  }

  .guess-list {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    max-height: calc(4 * 25px);
    font-size: 14px;
    overflow: hidden;
    padding: 5px;

    .guess-item {
      width: calc(50%);
      padding: 3px 5px;
      padding-right: 8px;
      box-sizing: border-box;
      // 文字不允许换行（单行文本）
      white-space: nowrap;
      // 溢出部分隐藏
      overflow: hidden;
      // 文本溢出后，使用 ... 代替
      text-overflow: ellipsis;
    }
  }
}
</style>
