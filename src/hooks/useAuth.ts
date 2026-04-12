'use client';

import { useState, useEffect } from 'react';
import { authService, AuthResponse, LoginRequest, RegisterRequest } from '@/services/authService';

export interface User {
  uid: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  role: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Wrapper pour capturer les erreurs non gérées
  const withErrorHandling = async (fn: () => Promise<any>) => {
    try {
      return await fn();
    } catch (err: any) {
      console.error('useAuth - Erreur capturée:', err);
      const errorMessage = err?.response?.data?.message || err?.message || 'Erreur inconnue';
      setError(errorMessage);
      throw err;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (err) {
        console.error('Erreur lors de la restauration de l\'utilisateur:', err);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials: LoginRequest) => {
    return withErrorHandling(async () => {
      setLoading(true);
      setError(null);
      try {
        const response: AuthResponse = await authService.login(credentials);
        if (response.token && response.user) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
          setUser(response.user);
          return response;
        } else {
          throw new Error('Réponse invalide du backend');
        }
      } finally {
        setLoading(false);
      }
    });
  };

  const register = async (userData: RegisterRequest) => {
    return withErrorHandling(async () => {
      setLoading(true);
      setError(null);
      try {
        const response: AuthResponse = await authService.register(userData);
        if (response.token && response.user) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
          setUser(response.user);
          return response;
        } else {
          throw new Error('Réponse invalide du backend');
        }
      } finally {
        setLoading(false);
      }
    });
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error('Erreur lors de la déconnexion:', err);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };
};
