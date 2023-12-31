import Swal from 'https://cdn.jsdelivr.net/npm/sweetalert2@11.10.1/+esm';

const swalMixin = {
  methods: {
    showToast(icon, title, fn) {
      Swal.fire({
        icon,
        title,
        toast: true,
        position: 'top',
        timer: 2500,
        timerProgressBar: true,
        showConfirmButton: false,
        width: 'auto',
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
      }).then(() => {
        if (typeof fn === 'function') {
          fn();
        }
      });
    },

    showCheck(icon, title, text, fn) {
      Swal.fire({
        icon,
        title,
        text,
        showCancelButton: true,
        confirmButtonText: '確認',
        cancelButtonText: '取消',
        reverseButtons: true,
      }).then((result) => {
        if (result.isConfirmed && typeof fn === 'function') {
          fn();
        }
      });
    },
  },
};

export default swalMixin;
