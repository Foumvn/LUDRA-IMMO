// components/common/LoginModal.tsx
'use client';

import { useTranslation } from 'react-i18next';
import { X, Phone, Heart, Calendar } from 'lucide-react';
import { Card } from '@/components/common/ui/Card';
import { Button } from '@/components/common/ui/Button';
import Link from 'next/link';
import URL from '@/utilis/url/url_front';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  actionType?: 'contact' | 'favorite' | 'schedule' | 'general';
}

export default function LoginModal({ isOpen, onClose, actionType = 'general' }: LoginModalProps) {
  const { t } = useTranslation();

  // Fermer le modal quand on clique en dehors
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const getIcon = () => {
    switch (actionType) {
      case 'contact':
        return <Phone className="h-8 w-8 text-primary" />;
      case 'favorite':
        return <Heart className="h-8 w-8 text-primary" />;
      case 'schedule':
        return <Calendar className="h-8 w-8 text-primary" />;
      default:
        return <Phone className="h-8 w-8 text-primary" />;
    }
  };

  const getTitle = () => {
    switch (actionType) {
      case 'contact':
        return t('login_modal.contact_title');
      case 'favorite':
        return t('login_modal.favorite_title');
      case 'schedule':
        return t('login_modal.schedule_title');
      default:
        return t('login_modal.general_title');
    }
  };

  const getDescription = () => {
    switch (actionType) {
      case 'contact':
        return t('login_modal.contact_description');
      case 'favorite':
        return t('login_modal.favorite_description');
      case 'schedule':
        return t('login_modal.schedule_description');
      default:
        return t('login_modal.general_description');
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <Card className="max-w-md w-full p-6 relative animate-fade-in bg-white">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full transition-colors"
          aria-label={t('common.close')}
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>
        
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            {getIcon()}
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {getTitle()}
          </h3>
          <p className="text-gray-600">
            {getDescription()}
          </p>
        </div>

        <div className="space-y-3">
          <Link href={URL.auth.login} className="block w-full" onClick={onClose}>
            <Button className="w-full" size="lg">
              {t('login_modal.login')}
            </Button>
          </Link>
        </div>

        <p className="text-center text-sm text-gray-500 mt-4">
          {t('login_modal.benefits')}
        </p>
      </Card>
    </div>
  );
}