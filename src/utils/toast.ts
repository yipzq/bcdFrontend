import { toast } from 'react-toastify';

type ToastType = 'info' | 'success' | 'warning' | 'error';

export const print = (message: string, type: ToastType = 'info') => {
  switch (type) {
    case 'success':
      return toast.success(message);
    case 'warning':
      return toast.warning(message);
    case 'error':
      return toast.error(message);
    default:
      return toast.info(message);
  }
};