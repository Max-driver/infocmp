<template>
  <view>
    <view class="my-userinfo-container">
      <!-- 头像昵称区域 -->
      <view class="top-box">
        <image :src="userinfo.avatarUrl" class="avatar"></image>
        <view class="nickname">{{ userinfo.nickName }}</view>
      </view>

      <!-- 面板的列表区域 -->
      <view class="panel-list">
        <!-- 第一个面板 -->
        <view class="panel">
          <!-- panel 的主体区域 -->
          <view class="panel-body">
            <!-- panel 的 item 项 -->
            <view class="panel-item" @click="gotoStar('收藏商品')">
              <uni-icons type="star" size="30"></uni-icons>
              <text>收藏</text>
            </view>
            <view class="panel-item" @click="gotoStar('收藏店铺')">
              <uni-icons type="shop" size="30"></uni-icons>
              <text>收藏店铺</text>
            </view>
            <view class="panel-item" @click="gotoStar('足迹')">
              <uni-icons type="fire" size="30"></uni-icons>
              <text>足迹</text>
            </view>
          </view>
        </view>

        <!-- 第二个面板 -->
        <view class="panel">
          <!-- 面板的标题 -->
          <view class="panel-title" @click="gotoOrder('全部订单')">
            <view class="panel-title-left">我的订单</view>
            <view class="panel-title-right">
              <view>全部</view>
              <uni-icons type="right" size="12"></uni-icons>
            </view>
          </view>

          <!-- 面板的主体 -->
          <view class="panel-body">
            <!-- 面板主体中的 item 项 -->
            <view class="panel-item" @click="gotoOrder('待付款')">
              <image src="/static/my-icons/icon1.png" class="icon"></image>
              <text>待付款 toWaitPay</text>
            </view>

            <view class="panel-item" @click="gotoOrder('待收货')">
              <image src="/static/my-icons/icon2.png" class="icon"></image>
              <text>待收货 toWaitGoods</text>
            </view>

            <view class="panel-item" @click="gotoOrder('退货/退款')">
              <image src="/static/my-icons/icon3.png" class="icon"></image>
              <text>退款/退货 toBackGoods</text>
            </view>

            <view class="panel-item" @click="gotoOrder('全部订单')">
              <image src="/static/my-icons/icon4.png" class="icon"></image>
              <text>全部订单 toAllOrder</text>
            </view>
          </view>
        </view>

        <!-- 第三个面板 -->
        <view class="panel">
          <view class="panel-list-item" @click="chooseAddress">
            <text>收货地址</text>
            <uni-icons type="arrowright" size="15"></uni-icons>
          </view>
          <view class="panel-list-item" @click="customerService">
            <text>联系客服</text>
            <uni-icons type="arrowright" size="15"></uni-icons>
          </view>
          <view class="panel-list-item" @click="logout">
            <text>退出登录</text>
            <uni-icons type="arrowright" size="15"></uni-icons>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
  name: 'my-userinfo',

  data() {
    return {};
  },

  computed: {
    // 将 m_user 模块中的 userinfo 映射到当前页面中使用
    ...mapState('m_user', ['userinfo'])
  },

  methods: {
    ...mapMutations('m_user', ['updateUserInfo', 'updateToken', 'updateAddress']),

    // 跳转到收藏页面
    gotoStar(e) {
      switch (e) {
        case '收藏商品':
          uni.navigateTo({
            url: '/subpkg/star/star?name=' + e
          });
          break;
        case '收藏店铺':
          uni.navigateTo({
            url: '/subpkg/star_store/star_store?name=' + e
          });
          break;
        case '足迹':
          uni.navigateTo({
            url: '/subpkg/goods_history/goods_history?name=' + e
          });
          break;
        default:
          console.log('未知页面');
      }
    },

    // 跳转订单页面
    gotoOrder(e) {
      // 跳转到分包的搜索页面
      uni.navigateTo({
        url: '/subpkg/order/order?name=' + e
      });

      console.log(e);
    },

    // 退出登录
    async logout() {
      // 询问用户是否退出登录
      const res = await uni
        .showModal({
          title: '提示',
          content: '确定退出登录吗？'
        })
        .catch(err => err);

      //----------------Max--star---------------
      // 由于现在 wx 该 showModal API 的值为对象，所以不能使用解构
      // const [err, succ] = await uni
      //   .showModal({
      //     title: '提示',
      //     content: '确定退出登录吗？'
      //   })
      //   .catch(err => err);
      //-------------end-------------------------

      if (res && res.confirm) {
        // 用户确认了退出登录的操作
        // 需要清空 vuex 中的 userinfo、token 和 address
        this.updateUserInfo({});
        this.updateToken('');
        this.updateAddress({});
      }
    },

    // 选择地址
    chooseAddress() {
      console.log('选择地址');
    },

    // 联系客服
    customerService() {
      console.log('联系客服');
    }
  }
};
</script>

<style lang="scss">
.my-userinfo-container {
  height: 100%;
  // 为整个组件的结构添加浅灰色的背景
  background-color: #cbcbcb;

  .top-box {
    height: 400rpx;
    background-color: #c00000;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .avatar {
      display: block;
      width: 90px;
      height: 90px;
      border-radius: 45px;
      border: 2px solid white;
      box-shadow: 0 1px 5px black;
    }

    .nickname {
      color: white;
      font-weight: bold;
      font-size: 16px;
      margin-top: 10px;
    }
  }
}

// 前2个面板样式
.panel-list {
  padding: 0 10px;
  position: relative;
  top: -10px;

  .panel {
    background-color: white;
    border-radius: 10px;
    margin-bottom: 8px;

    .panel-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      line-height: 45px;
      padding: 0 10px;
      font-size: 15px;
      border-bottom: 1px solid #f4f4f4;

      .panel-title-right {
        font-size: 12px;
        color: #cbcbcb;

        view {
          display: inline-block;
          margin-right: 3px;
        }
      }
    }

    .panel-body {
      display: flex;
      justify-content: space-around;

      .panel-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-around;
        padding: 10px 0;

        text {
          font-size: 13px;
        }

        .icon {
          width: 35px;
          height: 35px;
        }
      }
    }
  }
}

// 第3个面板
.panel-list-item {
  height: 45px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 15px;
  padding: 0 10px;
}
</style>
