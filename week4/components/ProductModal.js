import { apiUrl, apiPath } from '../JS/config.js';
import axios from 'https://cdn.jsdelivr.net/npm/axios@1.6.2/+esm';

import modalMixin from '../mixins/modalMixin.js';
import swalMixin from '../mixins/swalMixin.js';

export default {
  template: `<div
    id="productModal"
    ref="modal"
    class="modal fade"
    tabindex="-1"
    aria-labelledby="productModalLabel"
    aria-hidden="true"
    data-bs-backdrop="static"
  >
    <div class="modal-dialog modal-xl">
      <div class="modal-content border-0">
        <div class="modal-header bg-dark text-white">
          <h5 id="productModalLabel" class="modal-title">
            <span>{{ isNewProduct ? '新增' : '編輯' }}產品</span>
          </h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col-sm-4">
              <label for="imageUrl" class="form-label mb-2">新增圖片（若無主要圖片則優先新增）</label>
              <div class="input-group mb-3">
                <input
                  id="imageUrl"
                  type="text"
                  class="form-control"
                  placeholder="請輸入圖片連結"
                  v-model="tempImgUrl"
                />
                <button class="btn btn-outline-secondary" type="button" @click="updateImage('add')">新增</button>
              </div>

              <div
                v-if="!tempProduct.imageUrl"
                class="border border-black border-opacity-50 mb-2"
                style="height: 150px; width: 100%; opacity: 0.7;"
              >
                <label
                  for="formFile"
                  class="form-label d-flex justify-content-center align-items-center h-100"
                  style="    cursor: pointer;"
                  >點擊上傳主要圖片</label
                >
                <input
                  class="form-control d-none"
                  type="file"
                  id="formFile"
                  ref="mainImgInput"
                  @change="uploadImage('mainImgInput')"
                />
              </div>

              <div class="mb-3 position-relative" v-if="tempProduct.imageUrl">
                <img
                  class="img-fluid"
                  :src="tempProduct.imageUrl"
                  alt="tempProduct.title"
                  v-if="tempProduct.imageUrl"
                />
                <div class="position-absolute top-0 end-0">
                  <button
                    class="btn btn-sm"
                    @click="showCheck('warning', '真的要刪除嗎', '刪除後將無法復原', () => tempProduct.imageUrl = '')"
                  >
                    ｘ
                  </button>
                </div>
              </div>

              <div class="d-flex flex-wrap">
                <div class="col-4 mb-2 position-relative" v-for="(img, index) in tempProduct.imagesUrl" :key="index">
                  <img class="w-100 h-100 px-1" :src="img" alt="tempProduct.title" style="object-fit: cover" />
                  <div class="position-absolute top-0 end-0">
                    <button
                      class="btn btn-sm"
                      @click="showCheck('warning', '真的要刪除嗎', '刪除後將無法復原', () => updateImage('del', img))"
                    >
                      ｘ
                    </button>
                  </div>
                </div>
                <div
                  class="col-4 mb-2 position-relative border border-black border-opacity-50"
                  style="aspect-ratio: 1/1; opacity: 0.7;"
                >
                  <label
                    for="otherImgInput"
                    class="mb-0 form-label d-flex justify-content-center align-items-center h-100"
                    style="    cursor: pointer;"
                    >點擊上傳<br />其它圖片</label
                  >
                  <input
                    class="form-control d-none"
                    type="file"
                    id="otherImgInput"
                    ref="otherImgInput"
                    @change="uploadImage('otherImgInput')"
                  />
                </div>
              </div>
            </div>

            <div class="col-sm-8">
              <div class="mb-3">
                <label for="title" class="form-label">標題<span class="text-danger"> *</span></label>
                <input
                  id="title"
                  type="text"
                  class="form-control"
                  placeholder="請輸入標題"
                  v-model="tempProduct.title"
                />
              </div>

              <div class="row">
                <div class="mb-3 col-md-6">
                  <label for="category" class="form-label">分類<span class="text-danger"> *</span></label>
                  <input
                    id="category"
                    type="text"
                    class="form-control"
                    placeholder="請輸入分類"
                    v-model="tempProduct.category"
                  />
                </div>

                <div class="mb-3 col-md-6">
                  <label for="unit" class="form-label">單位<span class="text-danger"> *</span></label>
                  <input
                    id="unit"
                    type="text"
                    class="form-control"
                    placeholder="請輸入單位"
                    v-model="tempProduct.unit"
                  />
                </div>
              </div>

              <div class="row">
                <div class="mb-3 col-md-6">
                  <label for="origin_price" class="form-label">原價<span class="text-danger"> *</span></label>
                  <input
                    id="origin_price"
                    type="number"
                    min="0"
                    class="form-control"
                    placeholder="請輸入原價"
                    v-model.number="tempProduct.origin_price"
                  />
                </div>

                <div class="mb-3 col-md-6">
                  <label for="price" class="form-label">售價<span class="text-danger"> *</span></label>
                  <input
                    id="price"
                    type="number"
                    min="0"
                    class="form-control"
                    placeholder="請輸入售價"
                    v-model.number="tempProduct.price"
                  />
                </div>

                <div class="mb-3 col-md-6">
                  <label for="developer" class="form-label">開發人員</label>
                  <input
                    id="developer"
                    type="text"
                    class="form-control"
                    placeholder="請輸入開發人員名稱"
                    v-model.number="tempProduct.developer"
                  />
                </div>
              </div>
              <hr />

              <div class="mb-3">
                <label for="description" class="form-label">產品描述</label>
                <textarea
                  id="description"
                  type="text"
                  class="form-control"
                  placeholder="請輸入產品描述"
                  v-model="tempProduct.description"
                >
                </textarea>
              </div>

              <div class="mb-3">
                <label for="content" class="form-label">說明內容</label>
                <textarea
                  id="content"
                  type="text"
                  class="form-control"
                  placeholder="請輸入說明內容"
                  v-model="tempProduct.content"
                >
                </textarea>
              </div>

              <div class="mb-3">
                <div class="form-check">
                  <input
                    id="is_enabled"
                    class="form-check-input"
                    type="checkbox"
                    :true-value="1"
                    :false-value="0"
                    v-model="tempProduct.is_enabled"
                  />
                  <label class="form-check-label" for="is_enabled">是否啟用</label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">取消</button>
          <button type="button" class="btn btn-primary" @click="$emit('update', tempProduct)">確認</button>
        </div>
      </div>
    </div>
  </div>`,

  props: ['product', 'isNewProduct'],

  watch: {
    product() {
      this.tempProduct = this.product;
    },
  },

  data() {
    return {
      tempProduct: {},
      tempImgUrl: '',
    };
  },

  methods: {
    uploadImage(action) {
      const imageFile = this.$refs[action].files[0];
      const formData = new FormData();
      formData.append('file-to-upload', imageFile);

      const api = `${apiUrl}/api/${apiPath}/admin/upload`;
      axios
        .post(api, formData)
        .then((res) => {
          if (action === 'mainImgInput') {
            this.tempProduct.imageUrl = res.data.imageUrl;
          } else if (action === 'otherImgInput') {
            if (!this.tempProduct.imagesUrl) this.tempProduct.imagesUrl = [];
            this.tempProduct.imagesUrl.push(res.data.imageUrl);
          }
          this.$refs[action].value = '';
          this.showToast('success', '上傳成功');
        })
        .catch((err) => {
          this.showToast('error', err.response?.data?.message || `上傳失敗`);
        });
    },
    updateImage(action, img) {
      if (action === 'add') {
        if (!this.tempProduct.imageUrl) {
          this.tempProduct.imageUrl = this.tempImgUrl;
        } else {
          if (!this.tempProduct.imagesUrl) this.tempProduct.imagesUrl = [];
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

  mixins: [modalMixin, swalMixin],
};
