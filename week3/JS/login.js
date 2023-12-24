import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';
import axios from 'https://cdn.jsdelivr.net/npm/axios@1.6.2/+esm';
import swalMixin from './swalMixin.js';

const app = {
  data() {
    return {
      user: {
        username: '',
        password: '',
      },
    };
  },
  methods: {
    async signIn() {
      if (!this.user.username || !this.user.password) return;

      try {
        const baseUrl = 'https://vue3-course-api.hexschool.io/v2';
        const response = await axios.post(`${baseUrl}/admin/signin`, this.user);

        const { token, expired } = response.data;
        document.cookie = `week2Token=${token}; expires=${new Date(expired)}`;

        const redirection = () => (window.location.href = 'index.html');
        this.showToast('success', '登入成功', redirection);
      } catch (err) {
        this.showToast('error', err.response.data?.message || `登入失敗`);
      }
    },
  },
  mixins: [swalMixin],
};

createApp(app).mount('#app');
