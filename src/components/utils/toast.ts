import { toast, Toaster as SonnerToaster } from 'sonner';

// Type definitions to match expected notify types
type ToastType = 'info' | 'success' | 'warning' | 'error';

export function showToast(message: string, type: ToastType = 'success', duration = 5000) {
  // Use an inline options object without type annotation
  const options = {
    duration: duration,
  };

  switch (type) {
    case 'success':
      toast.success(message, options);
      break;
    case 'error':
      toast.error(message, options);
      break;
    case 'warning':
      toast.warning(message, options);
      break;
    case 'info':
    default:
      toast.info(message, options);
      break;
  }
}

export const Toaster = SonnerToaster;

export { toast };