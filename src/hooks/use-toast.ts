// Simple toast replacement to avoid build errors
export const useToast = () => {
  return {
    toast: (options: any) => {
      console.log('Toast:', options.title || options.description || 'Message');
    }
  };
};

export const toast = (options: any) => {
  console.log('Toast:', options.title || options.description || 'Message');
};