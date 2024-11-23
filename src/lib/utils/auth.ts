import Cookies from 'js-cookie';

export const setAuthToken = (token: string) => {
  localStorage.setItem('accessToken', token);
  Cookies.set('auth', 'true', { expires: 7 });
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem('accessToken');
};

export const removeAuthToken = () => {
  localStorage.removeItem('accessToken');
  Cookies.remove('auth');
};

export const isAuthenticated = (): boolean => {
  return Cookies.get('auth') === 'true' && !!localStorage.getItem('accessToken');
};