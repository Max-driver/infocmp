<template>
  <view>
    <view class="goods-list">
      <view v-for="(item, index) in goodsList" :key="index" @click="gotoDetail(item)">
        <!-- 为 my-goods 组件动态绑定 goods 属性的值 -->
        <my-goods :goods="item"></my-goods>
      </view>
    </view>

    <view class="tip-text" v-if="goodsList.length === 0">
      <image :src="defaultPic"></image>
      <view class="null-tips">没有符合商品</view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      // 请求参数对象
      queryObj: {
        // 查询关键词
        query: '',
        // 商品分类Id
        cid: '',
        // 页码值
        pagenum: 1,
        // 每页显示多少条数据
        pagesize: 10
      },

      // 商品列表的数据
      goodsList: [],
      // 总数量，用来实现分页
      total: 0,
      // 默认的空图片
      defaultPic: 'https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png',
      // 是否正在请求数据
      isloading: false
    };
  },

  onLoad(option) {
    // 将页面参数转存到 this.queryObj 对象中
    this.queryObj.query = option.query || '';
    this.queryObj.cid = option.cid || '';
    // 调用获取商品列表数据的方法
    this.getGoodsList();
  },

  methods: {
    // 获取商品列表数据的方法
    async getGoodsList(cb) {
      // ** 打开节流阀
      this.isloading = true;
      // 发起请求
      const { data: res } = await uni.$http.get('/api/public/v1/goods/search', this.queryObj);
      // ** 关闭节流阀
      this.isloading = false;

      // 只要数据请求完毕，就立即按需调用 cb 回调函数
      cb && cb();

      if (res.meta.status !== 200) return uni.$showMsg();
      // 为数据赋值：通过展开运算符的形式，进行新旧数据的拼接
      this.goodsList = [...this.goodsList, ...res.message.goods];
      this.total = res.message.total;
    },

    // 点击跳转到商品详情页面
    gotoDetail(item) {
      uni.navigateTo({
        url: '/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id
      });
    }
  },

  // 上拉拉及触底事件
  onReachBottom() {
    // 判断是否还有下一页数据: 当前的页码值 * 每页显示多少条数据 >= 总数条数
    if (this.queryObj.pagenum * this.queryObj.pagesize >= this.total) return uni.$showMsg('数据加载完毕');
    // 判断是否正在请求其它数据，如果是，则不发起额外的请求
    if (this.isloading) return;

    // 让页码值自增 +1
    this.queryObj.pagenum += 1;
    // 重新获取列表数据
    this.getGoodsList();
  },

  // 下拉刷新事件
  onPullDownRefresh() {
    //重置关键数据
    this.queryObj.pagenum = 1;
    this.total = 0;
    this.isloading = false;
    this.goodsList = [];

    // 重新发起请求, 并且通过回调函数来停止下拉刷新
    this.getGoodsList(() => uni.stopPullDownRefresh());
  }
};
</script>

<style lang="scss">
.tip-text {
  height: 60vh;
  display: flex;
  flex-direction: column;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  overflow: hidden;

  view {
    text-align: center;
    margin-top: 10px;
  }
}
</style>
