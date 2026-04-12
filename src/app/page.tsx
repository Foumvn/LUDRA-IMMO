'use client';

import PropertyList from '@/pages/PropertyList';
import { useAuth } from '@/hooks/useAuth';

export default function Home() {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            LUDRA-IMMO
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Votre plateforme immobilière de confiance
          </p>
          <a 
            href="/login" 
            className="bg-primary-600 text-white px-6 py-3 rounded-md hover:bg-primary-700"
          >
            Se connecter
          </a>
        </div>
      </div>
    );
  }

  return (
    <main className="relative overflow-hidden">
      <PropertyList />
    </main>
  );
}