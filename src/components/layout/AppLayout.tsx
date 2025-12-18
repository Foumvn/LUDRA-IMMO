'use client';

import { ReactNode } from 'react';
import { useRole } from '@/hooks/useRole';
import Navbar from '@/components/layout/Navbar';
import NavbarLandlord from '@/components/layout/NavbarLandlord';
import NavbarAdmin from '@/components/layout/NavbarAdmin';
import Footer from '@/components/common/_others/Footer';

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { user, isAdmin, isLandlord, isLoading } = useRole();

  const renderNavbar = () => {
    if (isLoading) {
      return <Navbar />;
    }

    if (!user) {
      return <Navbar />;
    }

    if (isAdmin) {
      return <NavbarAdmin />;
    }

    if (isLandlord) {
      return <NavbarLandlord />;
    }

    return <Navbar />;
  };

  return (
    <div className="min-h-screen flex flex-col">
      {renderNavbar()}
      <main className="flex-1 pt-16">
        {children}
      </main>
      <Footer />
    </div>
  );
}