'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Mail, Phone, MapPin, Calendar, Edit2, 
  Shield, CheckCircle, Save, X,
  Plus, List, Users, Settings 
} from 'lucide-react';
import Link from "next/link";
import { Card } from '@/components/common/ui/Card';
import { Button } from '@/components/common/ui/Button';
import { LinkUpdate } from '@/components/common/ui/LinkUpdate';
import { Badge } from '@/components/common/ui/Badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/common/ui/Avatar';
import URL from '@/utilis/url/url_front';

interface ProfessionalProfileProps {
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
    city: string;
    role: 'user' | 'landlord' | 'admin';
    emailVerified: boolean;
    phoneVerified: boolean;
    createdAt: string;
    updatedAt: string;
  };
  isEditable?: boolean;
}

export default function ProfessionalProfile({ user, isEditable = false }: ProfessionalProfileProps) {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);

  const handleSave = () => {
    // Logique de sauvegarde à implémenter
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedUser(user);
    setIsEditing(false);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* En-tête du profil */}
        <Card className="p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
            {/* Avatar */}
            <Avatar className="h-20 w-20">
              <AvatarFallback className="bg-primary text-white text-lg font-semibold">
                {getInitials(editedUser.name)}
              </AvatarFallback>
            </Avatar>

            {/* Informations principales */}
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {editedUser.name}
                  </h1>
                  
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <Badge variant={editedUser.role === 'admin' ? 'destructive' : 'secondary'}>
                      <Shield className="h-3 w-3 mr-1" />
                      {t(`${editedUser.role}`)}
                    </Badge>
                    
                    {editedUser.emailVerified && (
                      <Badge variant="success" className="flex items-center">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        {t('profile_user.email_verified')}
                      </Badge>
                    )}
                    
                    {editedUser.phoneVerified && (
                      <Badge variant="success" className="flex items-center">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        {t('profile_user.phone_verified')}
                      </Badge>
                    )}
                  </div>
                </div>

                {isEditable && (
                  <div className="flex space-x-2">
                    {!isEditing ? (
                      <Button onClick={() => setIsEditing(true)} size="sm">
                        <Edit2 className="h-4 w-4 mr-2" />
                        {t('common.edit')}
                      </Button>
                    ) : (
                      <div className="flex space-x-2">
                        <Button variant="outline" onClick={handleCancel} size="sm">
                          <X className="h-4 w-4 mr-2" />
                          {t('common.cancel')}
                        </Button>
                        <Button onClick={handleSave} size="sm">
                          <Save className="h-4 w-4 mr-2" />
                          {t('common.save')}
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Informations de contact */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">
              {t('profile_user.contact_info')}
            </h2>
            
            <div className="space-y-4">
              {/* Email */}
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
                <div className="flex-1">
                  <div className="font-medium text-gray-900">Email</div>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editedUser.email}
                      onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-primary"
                    />
                  ) : (
                    <div className="text-gray-600 text-sm">{editedUser.email}</div>
                  )}
                </div>
              </div>

              {/* Téléphone */}
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{t('profile_user.phone')}</div>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editedUser.phone}
                      onChange={(e) => setEditedUser({ ...editedUser, phone: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-primary"
                    />
                  ) : (
                    <div className="text-gray-600 text-sm">{editedUser.phone}</div>
                  )}
                </div>
              </div>

              {/* Ville */}
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{t('profile_user.city')}</div>
                  {isEditing ? (
                    <input
                      value={editedUser.city}
                      onChange={(e) => setEditedUser({ ...editedUser, city: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-primary"
                    />
                  ) : (
                    <div className="text-gray-600 text-sm">{editedUser.city}</div>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Informations du compte */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">
              {t('profile_user.account_info')}
            </h2>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">{t('profile_user.member_since')}</span>
                <span className="font-medium">{formatDate(editedUser.createdAt)}</span>
              </div>
              
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">{t('profile_user.status')}</span>
                <Badge variant="success">
                  {t('profile_user.active')}
                </Badge>
              </div>
            </div>
          </Card>
        </div>

        {/* Actions rapides pour les propriétaires et admin */}
        {(editedUser.role === 'landlord' || editedUser.role === 'admin') && (
          <Card className="p-6 mt-6">
            <h2 className="text-lg font-semibold mb-4">
              {t('profile_user.quick_actions')}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {editedUser.role === 'landlord' && (
                <>
                  <LinkUpdate href={URL.landlord.addProperty} variant="outline" className="justify-start">
                    <Plus className="h-4 w-4 mr-2" />
                    {t('profile_user.add_property')}
                  </LinkUpdate>
                  <LinkUpdate href={URL.landlord.properties} variant="outline" className="justify-start">
                    <List className="h-4 w-4 mr-2" />
                    {t('profile_user.my_properties')}
                  </LinkUpdate>
                </>
              )}
              {editedUser.role === 'admin' && (
                <>
                  <LinkUpdate href={URL.admin.addUser} variant="outline" className="justify-start">
                    <Users className="h-4 w-4 mr-2" />
                    {t('profile_user.add_users')}
                  </LinkUpdate>
                  <LinkUpdate href={URL.admin.addProperties} variant="outline" className="justify-start">
                    <Settings className="h-4 w-4 mr-2" />
                    {t('profile_user.add_property')}
                  </LinkUpdate>
                </>
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}