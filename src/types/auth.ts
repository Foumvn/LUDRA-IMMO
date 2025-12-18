// types/auth.ts
import { User } from '@/types/users';

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  emailOrPhone: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  role: 'user' | 'landlord' | 'admin';
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}