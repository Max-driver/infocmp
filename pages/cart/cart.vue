<template>
  <view>
    <view class="cart-container" v-if="cart.length !== 0">
      <!-- 地址栏 -->
      <my-address></my-address>

      <!-- 购物车商品列表的标题区域 -->
      <view class="cart-title">
        <!-- 左侧图标 -->
        <uni-icons type="shop" size="18"></uni-icons>
        <!-- 描述文本 -->
        <text class="cart-title-text">购物车</text>
      </view>

      <!-- 商品列表区域 -->
      <!-- uni-swipe-action 是最外层包裹性质的容器 -->
      <uni-swipe-action>
        <block v-for="(goods, index) in cart" :key="index">
          <!-- uni-swipe-action-item 可以为其子节点提供滑动操作的效果。需要通过 options 属性来指定操作按钮的配置信息 -->
          <uni-swipe-action-item :right-options="options" @click="swipeActionClickHandler(goods)">
            <my-goods :goods="goods" :show-radio="true" :show-num="true" @radio-change="radioChangeHandler" @num-change="numberChangeHandler"></my-goods>
          </uni-swipe-action-item>
        </block>
      </uni-swipe-action>

      <!-- 商品结算 -->
      <my-settle></my-settle>
    </view>

    <view class="empty-cart" v-else>
      <image src="/static/cart_empty@2x.png" class="empty-img"></image>
      <text class="tip-text">空空如也~</text>
    </view>
  </view>
</template>

<script>
// 导入自己封装的 mixin 模块
import badgeMin from '@/mixins/tabbar-badge.js';

// 按需导入 mapState 辅助函数
import { mapState, mapMutations, mapGetters } from 'vuex';

export default {
  // 将 badgeMix 合并到当前的页面中进行使用
  mixins: [badgeMin],

  data() {
    return {
      options: [
        {
          // 显示的文本内容
          text: '删除',
          // 按钮的背景颜色
          style: {
            backgroundColor: '#C00000'
          }
        }
      ]
    };
  },

  computed: {
    // 将 m_cart 模块中的 cart 数组映射到当前页面中使用
    ...mapState('m_cart', ['cart'])
  },

  methods: {
    // 导入更新商品状态和数量的方法
    ...mapMutations('m_cart', ['updateGoodsState', 'updateGoodsCount', 'removeGoodsById']),

    // 商品的勾选状态发生了变化
    radioChangeHandler(e) {
      // e 的数据 -> {goods_id: 395, goods_state: false}
      // 商品的勾选状态发生了变化
      this.updateGoodsState(e);
    },

    // 商品的数量发生了变化
    numberChangeHandler(e) {
      // 商品的数量发生了变化
      this.updateGoodsCount(e);
    },

    // 点击滑动删除购物项
    swipeActionClickHandler(goods) {
      this.removeGoodsById(goods.goods_id);
    }
  }
};
</script>

<style lang="scss">
.cart-container {
  padding-bottom: 50px;
}
// 标题
.cart-title {
  height: 40px;
  display: flex;
  align-items: center;
  font-size: 14px;
  padding-left: 5px;
  border-bottom: 1px solid #efefef;
  .cart-title-text {
    margin-left: 10px;
  }
}

// 空白时购物车图片样式
.empty-cart {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 150px;

  .empty-img {
    width: 90px;
    height: 90px;
  }

  .tip-text {
    font-size: 12px;
    color: gray;
    margin-top: 15px;
  }
}
</style>
