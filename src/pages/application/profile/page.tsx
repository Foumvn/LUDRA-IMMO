// app/profil/page.tsx
'use client';

import { useSession } from 'next-auth/react';
import { useTranslation } from 'react-i18next';
import ProfessionalProfile from '@/components/common/_others/ProfessionalProfile';
import { mockUsers } from '@/data/users';

export default function ProfilPage() {
  const { data: session, status } = useSession();
  const { t } = useTranslation();

  // Afficher un loading pendant la vérification de la session
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  // Si pas de session, afficher un message
  if (!session?.user) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {t('profile_user.not_connected')}
          </h1>
          <p className="text-gray-600 mb-6">
            {t('profile_user.please_login')}
          </p>
          <a 
            href="/login"
            className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors"
          >
            {t('common.login')}
          </a>
        </div>
      </div>
    );
  }

  // Trouver l'utilisateur connecté dans les mockUsers
  const currentUser = mockUsers.find(user => user.id === session.user.id);

  // Si l'utilisateur n'est pas trouvé dans les mockUsers
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {t('profile_user.user_not_found')}
          </h1>
          <p className="text-gray-600">
            {t('profile_user.user_not_found_description')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <ProfessionalProfile 
      user={currentUser} 
      isEditable={true}
    />
  );
}