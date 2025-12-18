'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import AppLayout from './AppLayout';
import AuthLayout from './AuthLayout';

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const pathname = usePathname();
  
  const isAuthPage = pathname?.startsWith('/auth');

  if (isAuthPage) {
    return <AuthLayout>{children}</AuthLayout>;
  }

  return <AppLayout>{children}</AppLayout>;
}