// components/layout/NavbarLandlord.tsx
'use client';

import { memo, useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Menu, X, Home, Plus, BarChart3, Settings, LogOut, User, Building } from 'lucide-react';
import { Button } from '@/components/common/ui/Button';
import Link from "next/link";
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useRole } from '@/hooks/useRole';
import URL from '@/utilis/url/url_front';

const NavbarLandlord = memo(() => {
  const { t } = useTranslation();
  const { user, isLandlord } = useRole();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Rediriger si l'utilisateur n'est pas landlord
  useEffect(() => {
    if (user && !isLandlord) {
      router.push(URL.public.home);
    }
  }, [user, isLandlord, router]);

  const navigation = [
    { name: 'Tableau de bord', href: URL.landlord.dashboard, icon: BarChart3 },
    { name: 'Mes propriétés', href: URL.landlord.properties, icon: Home },
    { name: 'Ajouter une propriété', href: URL.landlord.addProperty, icon: Plus },
  ];

  // Fermer les menus quand on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMenuOpen && menuRef.current && !menuRef.current.contains(event.target as Node) && buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
      if (isProfileMenuOpen && profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (isMenuOpen) setIsMenuOpen(false);
        if (isProfileMenuOpen) setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isMenuOpen, isProfileMenuOpen]);

  const closeMenu = () => setIsMenuOpen(false);

  const handleLogout = async () => {
    await signOut({ callbackUrl: URL.public.home });
    setIsProfileMenuOpen(false);
  };

  const getUserDisplayName = () => {
    if (!user?.name) return '';
    return user.name.split(' ')[0];
  };

  if (!user) return null;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-primary backdrop-blur-md border-b border-gray-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href={URL.public.home} className="text-2xl font-bold text-white hover:opacity-80 transition-opacity">
              House<span className="text-secondary">Plateforme</span> 
            </Link>
          </div>

          {/* Navigation Desktop */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navigation.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center text-white/70 hover:text-white px-3 py-2 text-sm font-medium transition-colors duration-300"
                  >
                    <IconComponent className="h-4 w-4 mr-2" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Profile Menu Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative" ref={profileMenuRef}>
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg border border-gray-200 hover:border-primary hover:bg-primary-400 transition-colors"
              >
                <div className="w-8 h-8 bg-primary-300 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                  {getUserDisplayName().charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-white">
                  {getUserDisplayName()}
                </span>
              </button>

              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                    <p className="text-xs text-gray-500 capitalize">Propriétaire</p>
                  </div>
                  
                  {/* <Link
                    href={URL.landlord.dashboard}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setIsProfileMenuOpen(false)}
                  >
                    <User className="h-4 w-4 mr-3" />
                    Tableau de bord
                  </Link> */}
                  
                  <Link
                    href={URL.app.profile}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setIsProfileMenuOpen(false)}
                  >
                    <Settings className="h-4 w-4 mr-3" />
                    {t('navigation.profile')}
                  </Link>
                  
                  <div className="border-t border-gray-100 mt-1 pt-1">
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="h-4 w-4 mr-3" />
                      {t('navigation.logout')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              ref={buttonRef}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white/70 hover:text-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div ref={menuRef} className="md:hidden absolute top-16 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navigation.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center text-gray-700 hover:text-primary hover:bg-gray-50 px-3 py-3 rounded-md text-base font-medium transition-colors duration-300"
                    onClick={closeMenu}
                  >
                    <IconComponent className="h-5 w-5 mr-3" />
                    {item.name}
                  </Link>
                );
              })}

              <div className="pt-4 pb-3 border-t border-gray-200">
                <div className="space-y-3 px-2">
                  <div className="px-3 py-2 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                    <p className="text-xs text-gray-500 capitalize">Propriétaire</p>
                  </div>
                  
                  {/* <Link
                    href={URL.landlord.dashboard}
                    className="flex items-center text-gray-700 hover:text-primary hover:bg-gray-50 px-3 py-3 rounded-md text-base font-medium transition-colors"
                    onClick={closeMenu}
                  >
                    <User className="h-5 w-5 mr-3" />
                    Tableau de bord
                  </Link> */}
                  
                  <button
                    onClick={() => {
                      handleLogout();
                      closeMenu();
                    }}
                    className="flex items-center w-full text-red-600 hover:bg-red-50 px-3 py-3 rounded-md text-base font-medium transition-colors"
                  >
                    <LogOut className="h-5 w-5 mr-3" />
                    {t('navigation.logout')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
});

NavbarLandlord.displayName = 'NavbarLandlord';
export default NavbarLandlord;