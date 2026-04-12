'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import AnimatedBackground from '@/components/common/_others/AnimatedBackground';
import LoginForm from '@/components/auth/LoginForm';
import URL from '@/utilis/url/url_front';

export default function LoginPage() {
  const { isAuthenticated, user, loading, login } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && user) {
      const userRole = user.role;
      
      switch (userRole) {
        case 'admin':
          router.push(URL.admin.dashboard);
          break;
        case 'landlord':
          router.push(URL.landlord.dashboard);
          break;
        case 'user':
          router.push('/');
          break;
        default:
          router.push('/');
          break;
      }
    }
  }, [isAuthenticated, user, router]);

  const handleSuccess = async (credentials: { emailOrPhone: string; password: string }) => {
    try {
      // Utiliser notre système d'authentification custom
      await login({
        email: credentials.emailOrPhone,
        password: credentials.password
      });

    } catch (error) {
      throw error;
    }
  };

  if (loading) {
    return (
      <main className="relative min-h-screen flex items-center justify-center p-4">
        <AnimatedBackground />
        <div className="z-10 text-white">Chargement...</div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen flex items-center justify-center p-4">
      <AnimatedBackground />
      <div className="z-10 w-full max-w-lg">
        <LoginForm onSuccess={handleSuccess} />
      </div>
    </main>
  );
}