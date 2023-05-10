<template>
  <view>
    <view class="login-container">
      <!-- 提示登录的图标 -->
      <uni-icons type="contact-filled" size="100"></uni-icons>

      <!-- 登录按钮 -->

      <!-- --------------- 旧的 wx API 接口---------------- -->
      <!-- 可以从 @getuserinfo 事件处理函数的形参中，获取到用户的基本信息 -->
      <!-- <button type="primary" class="btn-login" open-type="getUserInfo" @getuserinfo="getUserInfo">一键登录</button> Max -->
      <!-- ----------------------end------------------------ -->

      <!-- ----------------- test--star---------------------------- -->
      <button type="primary" class="btn-login" @click="getUserProfile">一键登录</button>
      <!-- ---------------------end------------------------------- -->

      <!-- 登录提示 -->
      <view class="tips-text">登录后尽享更多权益</view>
    </view>
  </view>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
export default {
  name: 'my-login',

  data() {
    return {};
  },

  computed: {
    ...mapState('m_user', ['userinfo', 'redirectInfo'])
  },

  //-----------------------test--star----------------------
  // watch: {
  //   // 监听 total 值的变化
  //   userinfo: {
  //     handler: function(newVal) {
  //       console.log(this.userinfo);
  //     },

  //     immediate: true
  //   }
  // },
  //-----------------------end-----------------------------

  methods: {
    // 2. 调用 mapMutations 辅助方法，把 m_user 模块中的 updateUserInfo 映射到当前组件中使用
    ...mapMutations('m_user', ['updateUserInfo', 'updateToken', 'updateRedirectInfo']),

    // 获取微信用户的基本信息
    //------这是微信新的接口-----------------------
    getUserProfile() {
      uni.getUserProfile({
        desc: '你的授权信息',

        success: res => {
          // 3. 将用户的基本信息存储到 vuex 中
          this.updateUserInfo(res.userInfo);

          // 获取登录成功后的 Token 字符串
          // this.getToken(res);Max

          //------------------test--star-------------------------
          this.getToken('Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo');
        },
        //------------------end-------------------------------

        fail: res => {
          console.log(res);
          return uni.$showMsg('您取消了登入授权');
        }
      });
    },
    //--------------------------------------------------------

    //-------------这是微信老的接口--------------------
    // getUserInfo(e) {
    //   // 判断是否获取用户信息成功
    //   if (e.detail.errMsg === 'getUserInfo:fail auth deny') return uni.$showMsg('您取消了登录授权!');

    //   // 获取用户信息成功， e.detail.userInfo 就是用户的基本信息
    //   console.log(e.detail.userInfo);
    //   // 3. 将用户的基本信息存储到 vuex 中
    //   this.updateUserInfo(e.detail.userInfo);

    //   // 获取登录成功后的 Token 字符串
    //   this.getToken(e.detail);
    // },
    //-------------------------------------------------

    // 调用登录接口换取永久的 token
    async getToken(info) {
      //---------------test--star--------------------
      let res;
      try {
        const result = await uni.login();
        res = [null, result];
      } catch (e) {
        res = [e, null];
      }
      const [err, result] = res;
      //----------------end------------------------

      // 调用微信登录接口, 获取 code 对应的值
      // const [err, res] = await uni.login().catch(err => [err, {}]);Max

      // 判断是否 uni.login() 调用失败
      if (err || result.errMsg !== 'login:ok') return uni.$showError('登录失败!');

      //--------------Max--star-----------------------
      // 准备参数对象
      // const query = {
      //   code: result.code,
      //   encryptedData: info.encryptedData,
      //   iv: info.iv,
      //   rawData: info.rawData,
      //   signature: info.signature
      // };

      // 换取 token
      // const { data: loginResult } = await uni.$http.post('/api/public/v1/users/wxlogin', query);
      // if (loginResult.meta.status !== 200) return uni.$showMsg('登录失败!');

      // uni.$showMsg('登录成功');
      // 2. 更新 vuex 中的 token
      // this.updateToken(loginResult.message.token);
      //----------------Max--end---------------------

      //--------------test--star-------------------------
      if (!info) return uni.$showMsg('登录失败!');

      // 2. 更新 vuex 中的 token
      uni.$showMsg('登录成功');

      // 更新 vuex 中的 token
      this.updateToken(info);
      //----------------end-------------------------

      // 判断 vuex 中的 redirectInfo 是否为 null
      // 如果不为 null，则登录成功之后，需要重新导航到对应的页面
      this.navigateBack();
    },

    // 返回登录之前的页面
    navigateBack() {
      // redirectInfo 不为 null，并且导航方式为 switchTab
      if (this.redirectInfo && this.redirectInfo.openType === 'switchTab') {
        // 调用小程序提供的 uni.switchTab() API 进行页面的导航
        uni.switchTab({
          // 要导航到的页面地址
          url: this.redirectInfo.from,

          // 导航成功之后，把 vuex 中的 redirectInfo 对象重置为 null
          complete: () => {
            this.updateRedirectInfo(null);
          }
        });
      }
    }
  }
};
</script>

<style lang="scss">
.login-container {
  // 登录盒子的样式
  height: 750rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f8f8f8;
  position: relative;
  overflow: hidden;

  // 绘制登录盒子底部的半椭圆造型
  &::after {
    content: ' ';
    display: block;
    position: absolute;
    width: 100%;
    height: 40px;
    left: 0;
    bottom: 0;
    background-color: white;
    border-radius: 100%;
    transform: translateY(50%);
  }

  // 登录按钮的样式
  .btn-login {
    width: 90%;
    border-radius: 100px;
    margin: 15px 0;
    background-color: #c00000;
  }

  // 按钮下方提示消息的样式
  .tips-text {
    font-size: 12px;
    color: gray;
  }
}
</style>
