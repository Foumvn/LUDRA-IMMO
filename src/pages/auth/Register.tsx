// app/auth/register/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import AnimatedBackground from '@/components/common/_others/AnimatedBackground';
import RegisterForm from '@/components/auth/RegisterForm';
import URL from '@/utilis/url/url_front';

export default function RegisterPage() {
  const { isAuthenticated, user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

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
        <RegisterForm />
      </div>
    </main>
  );
}