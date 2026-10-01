import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const SchoolContext = createContext(null);

export const SchoolProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    schoolName: 'Greenwood International School',
    tagline: 'Excellence in Education, Character & Innovation',
    academicYear: '2026-2027',
    currencySymbol: '₹',
    phone: '+91 80 4123 4567',
    email: 'admin@greenwoodschool.edu',
    address: 'Plot 42, Knowledge Boulevard, Sector 18, Bangalore',
  });
  const [classes, setClasses] = useState([]);
  const [loadingClasses, setLoadingClasses] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Toast notification helper
  const addToast = useCallback((message, type = 'success', duration = 3500) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Fetch School Settings
  const fetchSettings = useCallback(async () => {
    try {
      const res = await api.getSettings();
      if (res.success && res.data) {
        setSettings(res.data);
      }
    } catch (err) {
      console.error('Failed to load settings:', err);
    }
  }, []);

  // Fetch Classes with Divisions
  const fetchClasses = useCallback(async () => {
    setLoadingClasses(true);
    try {
      const res = await api.getClasses();
      if (res.success && res.data) {
        setClasses(res.data);
      }
    } catch (err) {
      console.error('Failed to load classes:', err);
    } finally {
      setLoadingClasses(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  // Currency Formatter Helper
  const formatCurrency = useCallback((amount) => {
    const sym = settings?.currencySymbol || '₹';
    const num = Number(amount) || 0;
    return `${sym} ${num.toLocaleString('en-IN')}`;
  }, [settings?.currencySymbol]);

  return (
    <SchoolContext.Provider
      value={{
        settings,
        setSettings,
        fetchSettings,
        classes,
        fetchClasses,
        loadingClasses,
        toasts,
        addToast,
        removeToast,
        formatCurrency,
      }}
    >
      {children}
    </SchoolContext.Provider>
  );
};

export const useSchool = () => {
  const context = useContext(SchoolContext);
  if (!context) throw new Error('useSchool must be used within a SchoolProvider');
  return context;
};
