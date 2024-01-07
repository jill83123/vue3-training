export default {
  template: `<div
    class="modal fade"
    id="productModal"
    tabindex="-1"
    role="dialog"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
    ref="modal"
  >
    <div class="modal-dialog modal-xl" role="document">
      <div class="modal-content border-0">
        <div class="modal-header bg-dark text-white">
          <h5 class="modal-title" id="exampleModalLabel">
            <span>{{ product.title }}</span>
          </h5>
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col-sm-6 d-flex">
              <img class="img-fluid" style="object-fit: contain;" :src="product.imageUrl" :alt="product.title" />
            </div>
            <div class="col-sm-6">
              <span class="badge bg-primary rounded-pill mb-1">{{ product.category }}</span>
              <p>商品描述：<br />{{ product.description }}</p>
              <p>開發商：<br />{{ product.developer }}</p>
              <p>商品內容：<br />{{ product.content }}</p>
              <div v-if="product.price === product.origin_price" class="h5 mb-3">{{ product.price }} 元</div>
              <template v-else>
                <del class="h6">原價 {{ product.origin_price }} 元</del>
                <div class="h5 mb-3">現在只要 {{ product.price }} 元</div>
              </template>
              <div>
                <div class="input-group">
                  <input type="number" class="form-control" min="1" v-model.number="quantity" />
                  <button type="button" class="btn btn-primary" @click="$emit('addToCart',product.id, quantity)">
                    加入購物車
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>`,

  data() {
    return {
      modal: null,
      quantity: 1,
    };
  },

  props: ['product'],

  watch: {
    product() {
      this.quantity = 1;
    },
  },

  methods: {
    show() {
      this.modal.show();
    },
    hide() {
      this.modal.hide();
    },
  },

  mounted() {
    this.modal = new bootstrap.Modal(this.$refs.modal);
  },
};
