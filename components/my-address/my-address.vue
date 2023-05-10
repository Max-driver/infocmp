<template>
  <view>
    <!-- 选择收货地址的盒子 -->
    <!-- decodeURIComponent() -->
    <view class="address-choose-box" v-if="JSON.stringify(address) === '{}'">
      <button type="primary" size="mini" class="btnChooseAddress" @click="chooseAddress">请选择收货地址+</button>
    </view>

    <!-- 渲染收货信息的盒子 -->
    <view class="address-info-box" v-else @click="chooseAddress">
      <!-- 第一行 -->
      <view class="row1">
        <!-- 左边 -->
        <view class="row1-left">
          <view class="username">
            收货人：
            <!-- <text>{{ address.userName }}</text> -->
            <text>张三</text>
          </view>
        </view>
        <!-- 右边 -->
        <view class="row1-right">
          <view class="phone">
            电话：
            <!-- <text>{{ address.telNumber }}</text> -->
            <text>13879456780</text>
          </view>
          <uni-icons type="arrowright" size="16"></uni-icons>
        </view>
      </view>

      <!-- 第二行 -->
      <view class="row2">
        <view class="row2-left">收货地址：</view>
        <view class="row2-right">{{ addstr }}</view>
      </view>
    </view>

    <!-- 底部的边框线 -->
    <image src="/static/cart_border@2x.png" class="address-border"></image>
  </view>
</template>

<script>
// 1. 按需导入 mapState 和 mapMutations 这两个辅助函数
import { mapState, mapMutations, mapGetters } from 'vuex';

export default {
  name: 'my-address',

  data() {
    return {
      // 收货地址
      // address: {}
    };
  },

  computed: {
    // 把 m_user 模块中的 address 对象映射当前组件中使用，代替 data 中 address 对象
    ...mapState('m_user', ['address']),

    // 将 m_user 模块中的 addstr 映射到当前组件中使用
    ...mapGetters('m_user', ['addstr'])
  },

  methods: {
    // 把 m_user 模块中的 updateAddress 函数映射到当前组件
    ...mapMutations('m_user', ['updateAddress']),

    // 选择收货地址
    async chooseAddress() {
      // 1. 调用小程序提供的 chooseAddress() 方法，即可使用选择收货地址的功能
      // const [err, succ] = await uni.chooseAddress().catch(err => err);

      // 新的微信 API 接口返回的是对象，不在是数组所以不能解构
      let res;
      try {
        const result = await uni.chooseAddress();
        res = [null, result];
      } catch (e) {
        res = [e, null];
      }
      const [err, result] = res;

      // 2. 用户成功的选择了收货地址
      if (err === null && result.errMsg === 'chooseAddress:ok') {
        // 为的收货地址对象赋值
        // this.address == result;
        // 更新 vuex 中的收货地址
        this.updateAddress(result);
      }

      // 3. 用户没有授权，安卓和苹果的提示不同
      if (err && (err.errMsg === 'chooseAddress:fail auth deny' || err.errMsg === 'chooseAddress:fail authorize no response')) {
        // 调用 this.reAuth() 方法，向用户重新发起授权申请
        this.reAuth();
      }
    },

    // 调用此方法，重新发起收货地址的授权
    async reAuth() {
      // 3.1 提示用户对地址进行授权
      // const [err2, confirmResult] = await uni.showModal({
      //   content: '检测到您没打开地址权限，是否去设置打开？',
      //   confirmText: '确定',
      //   cancelText: '取消'
      // });

      // API 返回对象不再是数组，所以无法解构
      const confirmResult = await uni.showModal({
        content: '检测到您没打开地址权限，是否去设置打开？',
        confirmText: '确定',
        cancelText: '取消'
      });

      // 3.2 如果弹框异常，则直接退出
      if (!confirmResult) return;

      // 3.3 如果用户点击了 “取消” 按钮，则提示用户 “您取消了地址授权！”
      if (confirmResult.cancel) return uni.$showMsg('您取消了授权！');

      // 3.4 如果用户点击了 “确认” 按钮，则调用 uni.openSetting() 方法进入授权页面，让用户重新进行授权
      if (confirmResult.confirm)
        return uni.openSetting({
          // 3.4.1 授权结束，需要对授权的结果做进一步判断
          success: settingResult => {
            // 3.4.2 地址授权的值等于 true，提示用户 “授权成功”
            if (settingResult.authSetting['scope.address']) return uni.$showMsg('授权成功！请选择地址');

            // 3.4.3 地址授权的值等于 false，提示用户 “您取消了地址授权”
            if (!settingResult.authSetting['scope.address']) return uni.$showMsg('您取消了地址授权');
          }
        });
    }
  }
};
</script>

<style lang="scss">
// 底部边框线的样式
.address-border {
  display: block;
  width: 100%;
  height: 5px;
}

// 选择收货地址的盒子
.address-choose-box {
  height: 90px;
  display: flex;
  align-items: center;
  justify-content: center;
}

// 渲染收货信息的盒子
.address-info-box {
  font-size: 12px;
  height: 90px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 5px;

  // 第一行
  .row1 {
    display: flex;
    justify-content: space-between;

    .row1-right {
      display: flex;
      align-items: center;

      .phone {
        margin-right: 5px;
      }
    }
  }

  // 第二行
  .row2 {
    display: flex;
    align-items: center;
    margin-top: 10px;

    .row2-left {
      white-space: nowrap;
    }
  }
}
</style>
