import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const stored = JSON.parse(localStorage.getItem('auth')) || {};
  const [token, setToken] = useState(stored.token || '');
  const [role, setRole] = useState(stored.role || '');

  const login = (newToken, userRole) => {
    localStorage.setItem('auth', JSON.stringify({ token: newToken, role: userRole }));
    setToken(newToken);
    setRole(userRole);
  };

  const logout = () => {
    localStorage.removeItem('auth');
    setToken('');
    setRole('');
  };

  return (
    <AuthContext.Provider value={{ token, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
