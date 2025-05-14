import { useContext } from 'react';
import { UserContext } from '../context/UserContext'; // ✅ Removed ".jsx" for standard practice

const useAuth = () => {
  const { user } = useContext(UserContext);

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';

  return { user, isAuthenticated, isAdmin };
};

export default useAuth;
