export const isAdmin = () => {
  const token = localStorage.getItem('token');
  const isDevMode = import.meta.env.VITE_DEV_MODE === 'true';

  return isDevMode || token
};
