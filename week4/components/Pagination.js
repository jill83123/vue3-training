export default {
  template: `<nav aria-label="Page navigation example" class="d-flex justify-content-center">
    <ul class="pagination mb-0">
      <li class="page-item" :class="{ 'disabled': pagination.current_page === 1 }">
        <a
          class="page-link"
          href="#"
          aria-label="Previous"
          @click.prevent="$emit('change-page',(pagination.current_page - 1))"
        >
          <span aria-hidden="true">&laquo;</span>
        </a>
      </li>
      <li
        class="page-item"
        :class="{ 'active': page === pagination.current_page }"
        v-for="page in pagination.total_pages"
        :key="page"
      >
        <a class="page-link" href="#" @click.prevent="$emit('change-page', page)">{{ page }}</a>
      </li>
      <li class="page-item" :class="{ 'disabled': pagination.current_page === pagination.total_pages }">
        <a
          class="page-link"
          href="#"
          aria-label="Next"
          @click.prevent="$emit('change-page',(pagination.current_page + 1))"
        >
          <span aria-hidden="true">&raquo;</span>
        </a>
      </li>
    </ul>
  </nav>`,

  props: ['pagination'],
};
