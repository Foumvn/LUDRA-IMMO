// components/common/modals/UserDetailModal.tsx
'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  X, User, Mail, Phone, MapPin, Calendar, Shield, 
  Edit, Trash2, CheckCircle, XCircle, Clock
} from 'lucide-react';
import { User as UserType } from '@/types/users';
import { Button } from '@/components/common/ui/Button';
import { Card } from '@/components/common/ui/Card';

interface UserDetailModalProps {
  user: UserType | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (user: UserType) => void;
  onDelete?: (userId: string) => void;
  showActions?: boolean;
}

export default function UserDetailModal({ 
  user, 
  isOpen,
  onClose,
  onEdit, 
  onDelete, 
  showActions = true
}: UserDetailModalProps) {
  const { t } = useTranslation();
  const [isDeleting, setIsDeleting] = useState(false);

  // Fermer le modal si on clique sur l'arrière-plan
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Fermer le modal avec la touche Échap
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    
    setIsDeleting(true);
    try {
      await onDelete(user!.id);
      onClose(); // Ferme le modal après suppression
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = () => {
    if (onEdit && user) {
      onEdit(user);
      onClose(); // Ferme le modal après édition
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'landlord':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive 
      ? 'bg-green-100 text-green-800 border-green-200'
      : 'bg-red-100 text-red-800 border-red-200';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isOpen || !user) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* En-tête du modal */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <User className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-semibold text-gray-900">
              {t('admin_users.user_details')}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {showActions && onEdit && (
              <Button
                variant="outline"
                onClick={handleEdit}
                className="flex items-center gap-2 border-primary text-primary hover:bg-primary-50"
              >
                <Edit className="h-4 w-4" />
                {t('common.edit')}
              </Button>
            )}
            {showActions && onDelete && (
              <Button
                variant="danger"
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex items-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {t('common.deleting')}
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" />
                    {t('common.delete')}
                  </>
                )}
              </Button>
            )}
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Contenu du modal */}
        <div className="p-6">
          <Card className="p-6 bg-white shadow-lg">
            {/* En-tête avec photo et informations principales */}
            <div className="flex flex-col lg:flex-row gap-6 mb-6">
              {/* Photo de profil */}
              <div className="flex-shrink-0">
                <div className="relative">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-20 h-20 rounded-full object-cover border-4 border-primary shadow-lg"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center border-4 border-primary shadow-lg">
                      <User className="h-10 w-10 text-primary" />
                    </div>
                  )}
                  {/* Badge statut en ligne */}
                  <div className={`absolute bottom-1 right-1 w-3 h-3 rounded-full border-2 border-white ${
                    user.isActive ? 'bg-green-500' : 'bg-gray-400'
                  }`} />
                </div>
              </div>

              {/* Informations principales */}
              <div className="flex-1">
                <div className="mb-4">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">{user.name}</h2>
                  <div className="flex flex-wrap gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getRoleColor(user.role)}`}>
                      {t(`admin_users.roles.${user.role}`)}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(user.isActive)}`}>
                      {user.isActive ? t('admin_users.status.active') : t('admin_users.status.inactive')}
                    </span>
                  </div>
                </div>

                {/* Informations de contact rapides */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Mail className="h-4 w-4 text-gray-600 flex-shrink-0" />
                    <div className="flex-1">
                      <span className="text-gray-700 block">{user.email}</span>
                      <div className="flex items-center gap-1 mt-1">
                        {user.emailVerified ? (
                          <>
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            <span className="text-xs text-green-600">{t('admin_users.verified')}</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="h-3 w-3 text-red-500" />
                            <span className="text-xs text-red-600">{t('admin_users.not_verified')}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Phone className="h-4 w-4 text-gray-600 flex-shrink-0" />
                    <div className="flex-1">
                      <span className="text-gray-700 block">{user.phone}</span>
                      <div className="flex items-center gap-1 mt-1">
                        {user.phoneVerified ? (
                          <>
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            <span className="text-xs text-green-600">{t('admin_users.verified')}</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="h-3 w-3 text-red-500" />
                            <span className="text-xs text-red-600">{t('admin_users.not_verified')}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Informations détaillées */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 border-t pt-6">
              {/* Informations de localisation */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  {t('admin_users.location_info')}
                </h3>
                
                <div className="space-y-3">
                  {user.city ? (
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      {/* <MapPin className="h-4 w-4 text-gray-600 mr-3" /> */}
                      <div>
                        <span className="text-gray-700 block">{user.city}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <MapPin className="h-4 w-4 text-gray-400 mr-3" />
                      <span className="text-gray-500 italic">{t('admin_users.no_city')}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Informations du compte */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  {t('admin_users.account_info')}
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-gray-600" />
                      <span className="text-gray-700">{t('admin_users.member_since')}</span>
                    </div>
                    <span className="text-gray-900 font-medium text-sm">
                      {formatDate(user.createdAt)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Clock className="h-4 w-4 text-gray-600" />
                      <span className="text-gray-700">{t('admin_users.last_update')}</span>
                    </div>
                    <span className="text-gray-900 font-medium text-sm">
                      {formatDate(user.updatedAt)}
                    </span>
                  </div>

                  {/* Statut du compte */}
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Shield className="h-4 w-4 text-gray-600" />
                      <span className="text-gray-700">{t('admin_users.account_status')}</span>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.isActive ? t('admin_users.status.active') : t('admin_users.status.inactive')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}