import { toast } from "sonner";

export const useAuthToast = () => {
  const showSuccess = (message: string) => {
    toast.success(message, {
      duration: 3000,
      style: {
        background: '#10b981',
        color: 'white',
      },
    });
  };

  const showError = (message: string) => {
    toast.error(message, {
      duration: 5000,
      style: {
        background: '#ef4444',
        color: 'white',
      },
    });
  };

  const showLoading = (message: string) => {
    return toast.loading(message, {
      style: {
        background: '#3b82f6',
        color: 'white',
      },
    });
  };

  return {
    showSuccess,
    showError,
    showLoading,
  };
};