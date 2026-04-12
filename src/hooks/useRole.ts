// hooks/useRole.ts
import { useAuth } from './useAuth';

export function useRole() {
  const { user, loading, isAuthenticated } = useAuth();

  return {
    user,
    role: user?.role,
    isAuthenticated,
    isLoading: loading,
    isAdmin: user?.role === 'admin',
    isLandlord: user?.role === 'landlord',
    isUser: user?.role === 'user',
    hasRole: (roles: string | string[]) => {
      if (!user?.role) return false;
      if (Array.isArray(roles)) {
        return roles.includes(user.role);
      }
      return user.role === roles;
    }
  };
}