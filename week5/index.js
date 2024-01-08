import ProductModal from './userProductModal.js';

const { createApp } = Vue;

const apiUrl = 'https://vue3-course-api.hexschool.io/v2';
const apiPath = 'yu-api-2';

const app = createApp({
  data() {
    return {
      productList: [],
      tempProduct: {},
      cartList: [],
      tempCouponCode: '',
      orderInfo: { user: {}, message: '' },
      status: {
        isLoading: false,
        currentLoadingId: '',
      },
      debounceTimer: null,
    };
  },

  methods: {
    async getProductList() {
      this.status.isLoading = true;

      try {
        const res = await axios.get(`${apiUrl}/api/${apiPath}/products`);
        this.productList = res.data.products;
      } catch (err) {
        alert(err.response?.data?.message || `發生錯誤，請稍後再試`);
      }

      this.status.isLoading = false;
    },

    async addToCart(product_id, qty = 1) {
      this.status.currentLoadingId = product_id;

      const data = {
        product_id,
        qty,
      };
      try {
        const res = await axios.post(`${apiUrl}/api/${apiPath}/cart`, { data });
        await this.getCartList();
        alert(res.data.message);
      } catch (err) {
        alert(err.response?.data?.message || `發生錯誤，請稍後再試`);
      }

      this.status.currentLoadingId = '';
      this.$refs.productModal.hide();
    },

    async getCartList() {
      try {
        const res = await axios.get(`${apiUrl}/api/${apiPath}/cart`);
        this.cartList = res.data.data;
      } catch (err) {
        alert(err.response?.data?.message || `發生錯誤，請稍後再試`);
      }
    },

    async putCartItem(cart_id, product_id, qty) {
      if (qty <= 0) {
        const index = this.cartList.carts.findIndex((item) => item.id === cart_id);
        this.cartList.carts[index].qty = 1;
        alert('請輸入大於 0 的數字');
        return;
      }

      const data = {
        product_id,
        qty,
      };

      try {
        const res = await axios.put(`${apiUrl}/api/${apiPath}/cart/${cart_id}`, { data });
        this.getCartList();
        alert(res.data.message);
      } catch (err) {
        alert(err.response?.data?.message || `發生錯誤，請稍後再試`);
      }
    },

    async deleteCartItem(id) {
      this.status.currentLoadingId = id;

      try {
        const res = await axios.delete(`${apiUrl}/api/${apiPath}/cart/${id}`);
        this.getCartList();
        alert(res.data.message);
      } catch (err) {
        alert(err.response?.data?.message || `發生錯誤，請稍後再試`);
      }

      this.status.currentLoadingId = id;
    },

    async deleteCartAll() {
      try {
        const res = await axios.delete(`${apiUrl}/api/${apiPath}/carts`);
        this.cartList = [];
        alert(res.data.message);
      } catch (err) {
        alert(err.response?.data?.message || `發生錯誤，請稍後再試`);
      }
    },

    async postOrder() {
      if (!this.cartList.carts || this.cartList.carts.length <= 0) {
        alert('購物車目前沒有商品');
        return;
      }

      const data = { ...this.orderInfo };

      try {
        const res = await axios.post(`${apiUrl}/api/${apiPath}/order`, { data });
        this.cartList = [];
        this.orderInfo = { user: {}, message: '' };
        this.$refs.form.resetForm();
        alert(res.data.message);
      } catch (err) {
        alert(err.response?.data?.message || `發生錯誤，請稍後再試`);
      }
    },

    async applyCoupon(code) {
      try {
        const res = await axios.post(`${apiUrl}/api/${apiPath}/coupon`, { data: { code } });
        this.getCartList();
        alert(res.data.message);
      } catch (err) {
        alert(err.response?.data?.message || `發生錯誤，請稍後再試`);
      }
    },

    openModal(item) {
      this.tempProduct = { ...item };
      this.$refs.productModal.show();
    },

    debounce(fn, delay = 500) {
      if (this.debounceTimer != null) {
        clearTimeout(this.debounceTimer);
        this.debounceTimer = null;
      }

      this.debounceTimer = setTimeout(() => {
        fn.call(this);
      }, delay);
    },
  },

  mounted() {
    this.getProductList();
    this.getCartList();
  },

  components: { ProductModal },
});

// 定義全部的驗證規則
Object.keys(VeeValidateRules).forEach((rule) => {
  if (rule !== 'default') {
    VeeValidate.defineRule(rule, VeeValidateRules[rule]);
  }
});

app.component('VForm', VeeValidate.Form);
app.component('VField', VeeValidate.Field);
app.component('ErrorMessage', VeeValidate.ErrorMessage);

// 讀取外部的資源
VeeValidateI18n.loadLocaleFromURL('https://unpkg.com/@vee-validate/i18n@4.12.4/dist/locale/zh_TW.json');

// Activate the locale
VeeValidate.configure({
  generateMessage: VeeValidateI18n.localize('zh_TW'),
  validateOnInput: true,
});

app.use(VueLoading.LoadingPlugin);
app.component('Loading', VueLoading.Component);

app.mount('#app');
