import Swal from 'https://cdn.jsdelivr.net/npm/sweetalert2@11.10.1/+esm';

const Toast = Swal.mixin({
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
});

export function showToast(icon, title, fn) {
  Toast.fire({
    icon,
    title,
  }).then(() => {
    if (typeof fn === 'function') {
      fn();
    }
  });
}
