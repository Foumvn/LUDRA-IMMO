'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signIn } from 'next-auth/react';
import AnimatedBackground from '@/components/common/_others/AnimatedBackground';
import LoginForm from '@/components/auth/LoginForm';
import URL from '@/utilis/url/url_front';

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      const userRole = session.user.role;
      
      switch (userRole) {
        case 'admin':
          router.push(URL.admin.dashboard);
          break;
        case 'landlord':
          router.push(URL.landlord.dashboard);
          break;
        case 'user':
        default:
          router.push(URL.app.dashboard);
          break;
      }
    }
  }, [session, status, router]);

  const handleSuccess = async (credentials: { emailOrPhone: string; password: string }) => {
    try {
      const result = await signIn('credentials', {
        email: credentials.emailOrPhone,
        password: credentials.password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

    } catch (error) {
      throw error;
    }
  };

  if (status === 'loading') {
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