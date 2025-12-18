// data/users.ts
import { User } from '@/types/users';
import { AuthResponse } from '@/types/auth';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Papa Dollar',
    email: 'papa.dollar@email.com',
    phone: '+237612345678',
    city: 'Douala',
    role: 'admin',
    emailVerified: true,
    phoneVerified: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    name: 'Dollar Test',
    email: 'dollar.test@email.com',
    phone: '+237698765432',
    city: 'Yaoundé',
    role: 'landlord',
    emailVerified: true,
    phoneVerified: true,
    createdAt: '2024-01-10T14:30:00Z',
    updatedAt: '2024-01-10T14:30:00Z',
  },
  {
    id: '3',
    name: 'Fatou Diop',
    email: 'fatou.diop@email.com',
    phone: '+237677788899',
    city: 'Bafoussam',
    role: 'user',
    emailVerified: true,
    phoneVerified: true,
    createdAt: '2024-01-12T09:15:00Z',
    updatedAt: '2024-01-12T09:15:00Z',
  },
  {
    id: '4',
    name: 'Kofi Mensah',
    email: 'kofi.mensah@email.com',
    phone: '+237655544433',
    city: 'Limbe',
    role: 'landlord',
    emailVerified: true,
    phoneVerified: true,
    createdAt: '2024-01-08T16:45:00Z',
    updatedAt: '2024-01-08T16:45:00Z',
  },
  {
    id: '5',
    name: 'Amina Diallo',
    email: 'amina.diallo@email.com',
    phone: '+237633322211',
    city: 'Garoua',
    role: 'user',
    emailVerified: true,
    phoneVerified: true,
    createdAt: '2024-01-05T11:20:00Z',
    updatedAt: '2024-01-05T11:20:00Z',
  },
];

export const mockAuthResponse: AuthResponse = {
  user: mockUsers[0],
  token: 'mock-jwt-token',
  refreshToken: 'mock-refresh-token',
};

// Comptes de test avec mots de passe
export const testAccounts = [
  { email: 'papa.dollar@email.com', phone: '+237612345678', password: 'Password123', role: 'admin' },
  { email: 'dollar.test@email.com', phone: '+237698765432', password: 'Password123', role: 'landlord' },
  { email: 'fatou.diop@email.com', phone: '+237677788899', password: 'Password123', role: 'user' },
  { email: 'kofi.mensah@email.com', phone: '+237655544433', password: 'Password123', role: 'landlord' },
  { email: 'amina.diallo@email.com', phone: '+237633322211', password: 'Password123', role: 'user' },
];