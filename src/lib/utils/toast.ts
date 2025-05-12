import { toast, Toaster as SonnerToaster } from 'sonner';

// Type definitions to match expected notify types
type ToastType = 'info' | 'success' | 'warning' | 'error';

// This function is already being used across the codebase, so we keep the name
// but update the implementation to use sonner
export function showToast(message: string, type: ToastType = 'success', duration = 5000) {
    switch (type) {
        case 'success':
            toast.success(message, { duration });
            break;
        case 'error':
            toast.error(message, { duration });
            break;
        case 'warning':
            toast.warning(message, { duration });
            break;
        case 'info':
        default:
            toast.info(message, { duration });
            break;
    }
}

// Export the Toaster component directly, not as a type
export const Toaster = SonnerToaster;

// Also export the original toast for more advanced use cases
export { toast };