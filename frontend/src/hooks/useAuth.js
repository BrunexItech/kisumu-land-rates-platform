import { useApp } from '../context/AppContext';

export const useAuth = () => {
  const { user, isAuthenticated, login, logout } = useApp();
  return { user, isAuthenticated, login, logout };
};