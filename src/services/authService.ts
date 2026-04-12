import api from './api';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  phone: string;
  city: string;
}

export interface AuthResponse {
  token: string;
  user: {
    uid: string;
    name: string;
    email: string;
    phone: string;
    city: string;
    role: string;
  };
}

export const authService = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await api.post('/api/auth/login', credentials);
    // Le backend retourne { success: true, data: { token, user } }
    return response.data.data;
  },

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await api.post('/api/auth/register', userData);
    // Le backend retourne { success: true, data: { token, user } }
    return response.data.data;
  },

  async logout(): Promise<void> {
    await api.post('/api/auth/logout');
  },

  async refreshToken(): Promise<AuthResponse> {
    const response = await api.post('/api/auth/refresh');
    return response.data.data;
  }
};
