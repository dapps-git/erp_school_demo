import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('school_crm_token');
      const cachedUser = localStorage.getItem('school_crm_user');

      if (cachedUser) {
        try {
          setUser(JSON.parse(cachedUser));
        } catch (e) {}
      }

      if (token) {
        try {
          const res = await api.getMe();
          if (res.success && res.data) {
            setUser(res.data);
            localStorage.setItem('school_crm_user', JSON.stringify(res.data));
          }
        } catch (err) {
          console.warn('Session expired or invalid token:', err.message);
          localStorage.removeItem('school_crm_token');
          localStorage.removeItem('school_crm_user');
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await api.login({ email, password });
    if (res.success && res.data) {
      localStorage.setItem('school_crm_token', res.data.token);
      localStorage.setItem('school_crm_user', JSON.stringify(res.data));
      setUser(res.data);
      return res.data;
    }
    throw new Error(res.message || 'Login failed');
  };

  const logout = () => {
    localStorage.removeItem('school_crm_token');
    localStorage.removeItem('school_crm_user');
    setUser(null);
  };

  const updateProfile = async (data) => {
    const res = await api.updateProfile(data);
    if (res.success && res.data) {
      setUser((prev) => ({ ...prev, ...res.data }));
      localStorage.setItem('school_crm_user', JSON.stringify({ ...user, ...res.data }));
      return res.data;
    }
    throw new Error(res.message || 'Profile update failed');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateProfile, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
