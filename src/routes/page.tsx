'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import URL from '@/utilis/url/url_front';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { isAuthenticated, user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Si pathname est null, on attend
    if (pathname === null) return;

    // Si le chargement est terminé et l'utilisateur n'est pas authentifié
    if (!isLoading && !isAuthenticated) {
      const redirectUrl = `${URL.auth.login}?redirect=${encodeURIComponent(pathname)}`;
      router.push(redirectUrl);
      return;
    }

    // Si le chargement est terminé, l'utilisateur est authentifié mais n'a pas le rôle requis
    if (!isLoading && isAuthenticated && requiredRole && user?.role !== requiredRole) {
      const fallbackRoute = user?.role === 'landlord' ? URL.landlord.dashboard :
                           user?.role === 'admin' ? URL.admin.dashboard : URL.app.dashboard;
      router.push(fallbackRoute);
      return;
    }
  }, [isAuthenticated, isLoading, user, requiredRole, router, pathname]);

  // Afficher un loader pendant le chargement ou si pathname est null
  if (isLoading || pathname === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Si non authentifié ou mauvais rôle, ne rien afficher (la redirection est gérée par useEffect)
  if (!isAuthenticated || (requiredRole && user?.role !== requiredRole)) {
    return null;
  }

  return <>{children}</>;
}