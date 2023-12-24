import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';
import axios from 'https://cdn.jsdelivr.net/npm/axios@1.6.2/+esm';
import swalMixin from './swalMixin.js';

const baseUrl = 'https://vue3-course-api.hexschool.io/v2';
const api_path = 'yu-api-2';

const app = {
  data() {
    return {
      products: {},
      tempProduct: {},
      tempImgUrl: '',
      isNewProduct: false,
      isLoading: true,
      currentModal: null,
    };
  },
  methods: {
    async checkUser() {
      try {
        await axios.post(`${baseUrl}/api/user/check`);
        this.getProducts();
      } catch (err) {
        const redirection = () => (window.location.href = 'login.html');
        this.showToast('error', err.response?.data?.message || `請重新登入`, redirection);
      }
    },
    async getProducts() {
      this.isLoading = true;

      try {
        const res = await axios.get(`${baseUrl}/api/${api_path}/admin/products/all`);
        this.products = res.data.products;
      } catch (err) {
        this.showToast('error', err.response?.data?.message || `發生錯誤，請稍後再試`);
      }

      this.isLoading = false;
    },
    openModal(action, product) {
      let modalRef = '';

      this.tempImgUrl = '';
      this.isNewProduct = action === 'new';

      if (action === 'edit' || action === 'del') {
        this.tempProduct = JSON.parse(JSON.stringify(product));
      } else if (action === 'new') {
        this.tempProduct = {};
      }
      modalRef = 'productModal';

      if (action === 'del') {
        modalRef = 'delProductModal';
      }

      this.currentModal = new bootstrap.Modal(this.$refs[modalRef]);
      this.currentModal.show();
    },
    async updateProduct() {
      const id = this.tempProduct.id;
      const data = this.tempProduct;

      let api = `${baseUrl}/api/${api_path}/admin/product`;
      let methods = 'post';

      if (!this.isNewProduct) {
        api += `/${id}`;
        methods = 'put';
      }

      try {
        const res = await axios[methods](api, { data });
        this.showToast('success', res.data.message || `更新成功`);
        this.getProducts();
        this.currentModal.hide();
      } catch (err) {
        const message = (err.response?.data?.message || []).join(' 、 ');
        this.showToast('error', message || `發生錯誤，請稍後再試`);
      }
    },
    async deleteProduct() {
      const id = this.tempProduct.id;

      try {
        const res = await axios.delete(`${baseUrl}/api/${api_path}/admin/product/${id}`);
        this.showToast('success', res.data.message || `刪除成功`);
        this.getProducts();
        this.currentModal.hide();
      } catch (err) {
        this.showToast('error', err.response?.data?.message || `發生錯誤，請稍後再試`);
      }
    },
    updateImage(action, img) {
      if (action === 'add') {
        if (!this.tempProduct.imageUrl) {
          this.tempProduct.imageUrl = this.tempImgUrl;
        } else {
          this.tempProduct.imagesUrl.push(this.tempImgUrl);
        }
        this.tempImgUrl = '';
      }

      if (action === 'del') {
        const index = this.tempProduct.imagesUrl.indexOf(img);
        this.tempProduct.imagesUrl.splice(index, 1);
      }
    },
  },
  mounted() {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)week2Token\s*=\s*([^;]*).*$)|^.*$/, '$1');
    axios.defaults.headers.common['Authorization'] = token;
    this.checkUser();
  },
  mixins: [swalMixin],
};

createApp(app).mount('#app');
