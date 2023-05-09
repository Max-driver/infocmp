// 导入辅助函数
import {
  mapGetters
} from 'vuex'

// 导出一个 mixin 对象
export default {
  computed: {
    ...mapGetters('m_cart', ['total']),
  },

  watch: {
    // 监听 total 值的变化
    total: {
      handler: function(newVal) {
        this.isNullGoods()
      },

      immediate: true
    }

  },

  onShow() {
    // 在页面刚展示的时候，设置数字徽标
    this.isNullGoods()
  },

  methods: {

    // 非空则设置徽标
    isNullGoods() {
      if (this.total !== 0) {
        this.setBadge()
        return
      }
      this.removeBadge()

    },

    // 设置右上角的徽标
    setBadge() {
      // 调用 uni.setTabBarBadge() 方法，为购物车设置右上角的徽标
      uni.setTabBarBadge({
        index: 2,

        // 注意：text 的值必须是字符串，不能是数字
        text: this.total + '',
      })
    },

    // 移除购物车的徽标
    removeBadge() {
      if (this.total !== 0) return;
      uni.removeTabBarBadge({
        index: 2
      });
    }
  },
}