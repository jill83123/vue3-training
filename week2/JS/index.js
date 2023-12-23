import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';
import axios from 'https://cdn.jsdelivr.net/npm/axios@1.6.2/+esm';
import { showToast } from './swal.js';

const baseUrl = 'https://vue3-course-api.hexschool.io/v2';
const api_path = 'yu-api';

const app = {
  data() {
    return {
      products: {},
      tempData: null,
    };
  },
  methods: {
    async checkUser() {
      try {
        await axios.post(`${baseUrl}/api/user/check`);
        this.getProducts();
      } catch (err) {
        const redirection = () => (window.location.href = 'login.html');
        showToast('error', err.response.data?.message || `請重新登入`, redirection);
      }
    },
    async getProducts() {
      try {
        const res = await axios.get(`${baseUrl}/api/${api_path}/admin/products`);
        this.products = res.data.products;
      } catch (err) {
        showToast('error', err.response.data?.message || `發生錯誤，請稍後再試`);
      }
    },
  },
  mounted() {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)week2Token\s*=\s*([^;]*).*$)|^.*$/, '$1');
    axios.defaults.headers.common['Authorization'] = token;
    this.checkUser();
  },
};

createApp(app).mount('#app');
