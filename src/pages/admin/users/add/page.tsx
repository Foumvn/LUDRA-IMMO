'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, CheckCircle, Users } from 'lucide-react';

import AddUserForm from '@/components/common/form/AddUserForm';
import { Button } from '@/components/common/ui/Button';
import URL from '@/utilis/url/url_front';

export default function AddUsersPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (userData: any) => {
    console.log('Utilisateur créé par admin:', userData);
    // Ici vous enverriez les données à votre API
    setIsSuccess(true);
    
    // Redirection après 2 secondes
    setTimeout(() => {
      router.push(URL.admin.users);
    }, 2000);
  };

  const handleCancel = () => {
    router.back();
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {t('admin_add_user.success_title')}
            </h1>
            <p className="text-gray-600 mb-8">
              {t('admin_add_user.success_message')}
            </p>
            <Button onClick={() => router.push(URL.admin.users)}>
              {t('admin_add_user.view_users')}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* En-tête */}
        <div className="mb-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">
              {t('admin_add_user.page_title')}
            </h1>
            <p className="text-gray-600 mt-2">
              {t('admin_add_user.page_subtitle')}
            </p>
          </div>
        </div>

        {/* Formulaire */}
        <AddUserForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}