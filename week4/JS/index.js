import { apiUrl, apiPath } from './config.js';
import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';

import axios from 'https://cdn.jsdelivr.net/npm/axios@1.6.2/+esm';
import swalMixin from '../mixins/swalMixin.js';

import Pagination from '../components/Pagination.js';
import ProductModal from '../components/ProductModal.js';
import DelModal from '../components/DelModal.js';

const app = {
  data() {
    return {
      products: {},
      tempProduct: {},
      isNewProduct: false,
      isLoading: true,
      currentModal: null,
      pagination: {},
    };
  },

  methods: {
    async checkUser() {
      try {
        await axios.post(`${apiUrl}/api/user/check`);
        this.getProducts();
      } catch (err) {
        const redirection = () => (window.location.href = 'login.html');
        this.showToast('error', err.response?.data?.message || `請重新登入`, redirection);
      }
    },
    async getProducts(page = 1) {
      this.isLoading = true;

      try {
        const res = await axios.get(`${apiUrl}/api/${apiPath}/admin/products/?page=${page}`);
        this.products = res.data.products;
        this.pagination = res.data.pagination;
      } catch (err) {
        this.showToast('error', err.response?.data?.message || `發生錯誤，請稍後再試`);
      }

      this.isLoading = false;
    },
    openModal(action, product) {
      this.tempImgUrl = '';
      this.isNewProduct = action === 'new';

      if (action === 'edit' || action === 'del') {
        this.tempProduct = JSON.parse(JSON.stringify(product));
      } else if (action === 'new') {
        this.tempProduct = {};
      }
      this.currentModal = 'productModal';

      if (action === 'del') {
        this.currentModal = 'delModal';
      }

      this.$refs[this.currentModal].showModal();
    },
    async updateProduct(product) {
      const id = product.id;
      const data = product;

      let api = `${apiUrl}/api/${apiPath}/admin/product`;
      let methods = 'post';

      if (!this.isNewProduct) {
        api += `/${id}`;
        methods = 'put';
      }

      try {
        const res = await axios[methods](api, { data });
        this.showToast('success', res.data.message || `更新成功`);
        this.getProducts();
        this.$refs[this.currentModal].hideModal();
      } catch (err) {
        const message = (err.response?.data?.message || []).join(' 、 ');
        this.showToast('error', message || `發生錯誤，請稍後再試`);
      }
    },
    async deleteProduct(product) {
      const id = product.id;

      try {
        const res = await axios.delete(`${apiUrl}/api/${apiPath}/admin/product/${id}`);
        this.showToast('success', res.data.message || `刪除成功`);
        this.getProducts();
        this.$refs[this.currentModal].hideModal();
      } catch (err) {
        this.showToast('error', err.response?.data?.message || `發生錯誤，請稍後再試`);
      }
    },
  },

  mounted() {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)week2Token\s*=\s*([^;]*).*$)|^.*$/, '$1');
    axios.defaults.headers.common['Authorization'] = token;
    this.checkUser();
  },

  mixins: [swalMixin],

  components: { Pagination, ProductModal, DelModal },
};

createApp(app).mount('#app');
