import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(sessionStorage.getItem('token'));
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    try {
      const response = await axios.post('https://endcardapio.onrender.com/api/auth/login', {
        email,
        password,
      });
      const { token, user } = response.data;
      setToken(token);
      setUser(user);
      sessionStorage.setItem('token', token);
      return { success: true };
    } catch (error) {
      
      const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Erro desconhecido. Tente novamente.';
      console.error('Login failed:', errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    sessionStorage.removeItem('token');
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ token, user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};