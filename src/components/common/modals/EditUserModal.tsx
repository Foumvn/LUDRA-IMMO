'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  X, User, Mail, Phone, MapPin, Calendar, Shield,
  Camera, Edit, CheckCircle
} from 'lucide-react';
import { User as UserType } from '@/types/users';
import { Button } from '@/components/common/ui/Button';

interface EditUserModalProps {
  user: UserType | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: UserType) => void;
}

export default function EditUserModal({ user, isOpen, onClose, onSave }: EditUserModalProps) {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');

  const [formData, setFormData] = useState<Partial<UserType>>({
    name: '',
    email: '',
    phone: '',
    role: 'user',
    city: '',
    // dateOfBirth: '',
    emailVerified: false,
    phoneVerified: false,
    isActive: true,
  });

  const roles = [
    { value: 'user', label: 'admin_users.roles.user' },
    { value: 'landlord', label: 'admin_users.roles.landlord' },
    { value: 'admin', label: 'admin_users.roles.admin' },
  ];

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        city: user.city || '',
        // dateOfBirth: user.dateOfBirth || '',
        emailVerified: user.emailVerified ?? false,
        phoneVerified: user.phoneVerified ?? false,
        isActive: user.isActive ?? true,
      });

      // Réinitialiser l'avatar
      setAvatar(null);
      setAvatarPreview(user.avatar || '');
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatar(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      setAvatarPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeAvatar = () => {
    setAvatar(null);
    setAvatarPreview('');
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);

    try {
      const updatedUser: UserType = {
        ...user,
        ...formData,
        avatar: avatarPreview,
        updatedAt: new Date().toISOString(),
      };

      console.log('Utilisateur mis à jour:', updatedUser);

      // Simulation d'appel API
      await new Promise(resolve => setTimeout(resolve, 1000));

      onSave(updatedUser);
    } catch (error) {
      console.error('Erreur lors de la modification:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* En-tête */}
        <div className="flex justify-between items-center p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <Edit className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-semibold text-primary">
              {t('admin_users.edit_user')}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-primary" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Section Avatar */}
          <div className="flex flex-col items-center">
            <div className="relative mb-4">
              {avatarPreview ? (
                <div className="relative">
                  <img
                    src={avatarPreview}
                    alt="Avatar preview"
                    className="w-32 h-32 rounded-full object-cover border-4 border-primary"
                  />
                  <button
                    type="button"
                    onClick={removeAvatar}
                    className="absolute -top-2 -right-2 bg-secondary text-white rounded-full p-1"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center border-4 border-dashed border-primary">
                  <User className="h-12 w-12 text-gray-400" />
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              onClick={triggerFileInput}
              className="border border-primary text-primary hover:bg-primary-50"
            >
              <Camera className="h-4 w-4 mr-2" />
              {avatarPreview ? t('admin_users.change_avatar') : t('admin_users.upload_avatar')}
            </Button>
          </div>

          {/* Section Informations personnelles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nom complet */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-primary mb-2">
                <User className="h-4 w-4 inline mr-2" />
                {t('admin_users.labels.name')} *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white text-primary"
                placeholder={t('admin_users.placeholders.name')}
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                <Mail className="h-4 w-4 inline mr-2" />
                {t('admin_users.labels.email')} *
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white text-primary pr-10"
                  placeholder={t('admin_users.placeholders.email')}
                />
                {formData.emailVerified && (
                  <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500" />
                )}
              </div>
            </div>

            {/* Téléphone */}
            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                <Phone className="h-4 w-4 inline mr-2" />
                {t('admin_users.labels.phone')} *
              </label>
              <div className="relative">
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white text-primary pr-10"
                  placeholder={t('admin_users.placeholders.phone')}
                />
                {formData.phoneVerified && (
                  <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500" />
                )}
              </div>
            </div>

            {/* Rôle */}
            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                <Shield className="h-4 w-4 inline mr-2" />
                {t('admin_users.labels.role')} *
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white text-primary"
              >
                {roles.map(role => (
                  <option key={role.value} value={role.value}>
                    {t(role.label)}
                  </option>
                ))}
              </select>
            </div>

            {/* Date de naissance */}
            {/* <div>
              <label className="block text-sm font-medium text-primary mb-2">
                <Calendar className="h-4 w-4 inline mr-2" />
                {t('admin_users.labels.dateOfBirth')}
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white text-primary"
              />
            </div> */}
          </div>

          {/* Ville */}
          <div>
            <label className="block text-sm font-medium text-primary mb-2">
              <MapPin className="h-4 w-4 inline mr-2" />
              {t('admin_users.labels.city')}
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white text-primary"
              placeholder={t('admin_users.placeholders.city')}
            />
          </div>

          {/* Vérifications et statut */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="emailVerified"
                checked={formData.emailVerified}
                onChange={handleInputChange}
                className="rounded border-gray-300 text-primary focus:ring-primary"
                id="email-verified"
              />
              <label htmlFor="email-verified" className="ml-2 text-sm text-primary">
                {t('admin_users.labels.emailVerified')}
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="phoneVerified"
                checked={formData.phoneVerified}
                onChange={handleInputChange}
                className="rounded border-gray-300 text-primary focus:ring-primary"
                id="phone-verified"
              />
              <label htmlFor="phone-verified" className="ml-2 text-sm text-primary">
                {t('admin_users.labels.phoneVerified')}
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive ?? true}
                onChange={handleInputChange}
                className="rounded border-gray-300 text-primary focus:ring-primary"
                id="is-active"
              />
              <label htmlFor="is-active" className="ml-2 text-sm text-primary">
                {t('admin_users.labels.isActive')}
              </label>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="border border-primary text-primary hover:bg-primary-50"
            >
              {t('common.cancel')}
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-secondary text-white hover:bg-secondary-700 min-w-32"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {t('common.saving')}
                </>
              ) : (
                <>
                  <Edit className="h-4 w-4 mr-2" />
                  {t('common.save_changes')}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}