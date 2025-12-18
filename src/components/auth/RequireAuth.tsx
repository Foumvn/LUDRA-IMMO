'use client';

import { ReactNode } from 'react';
import { useRole } from '@/hooks/useRole';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

interface RequireAuthProps {
  children: ReactNode;
  roles?: string | string[];
  fallback?: ReactNode;
}

export default function RequireAuth({ 
  children, 
  roles, 
  fallback 
}: RequireAuthProps) {
  const { user, isAuthenticated, isLoading, hasRole } = useRole();
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    if (fallback) {
      return <>{fallback}</>;
    }
    router.push('/auth/login');
    return null;
  }

  if (roles && !hasRole(roles)) {
    if (fallback) {
      return <>{fallback}</>;
    }
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">Accès non autorisé</h2>
          <p>Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}