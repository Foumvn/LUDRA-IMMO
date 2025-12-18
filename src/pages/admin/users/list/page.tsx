'use client';

import { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSession } from 'next-auth/react';
import {
  Users, UserPlus, Mail, Phone, Calendar, Shield,
  Edit, Trash2, Search, Filter, MoreVertical
} from 'lucide-react';

import { mockUsers } from '@/data/users';
import { Button } from '@/components/common/ui/Button';
import { Card } from '@/components/common/ui/Card';
import { User } from '@/types/users';
import Link from 'next/link';
import URL from '@/utilis/url/url_front';
import Pagination, { ITEMS_PER_PAGE } from '@/components/common/_others/Pagination';
import EditUserModal from '@/components/common/modals/EditUserModal';
import DeleteConfirmationModal from '@/components/common/modals/DeleteUserModal';
import UserDetailModal from '@/components/common/modals/UserDetailModal';

type UsersFilters = {
  search: string;
  role: string;
  verified: string;
};

export default function UsersPage() {
  const { t } = useTranslation();
  const { data: session } = useSession();

  const [filters, setFilters] = useState<UsersFilters>({
    search: '',
    role: '',
    verified: ''
  });

  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openMenuId && !(event.target as Element).closest('.menu-container')) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openMenuId]);

  // Appliquer les filtres
  const filteredUsers = useMemo(() => {
    return mockUsers.filter(user => {
      if (filters.search && !user.name.toLowerCase().includes(filters.search.toLowerCase()) &&
        !user.email.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
      if (filters.role && user.role !== filters.role) {
        return false;
      }
      if (filters.verified === 'email' && !user.emailVerified) {
        return false;
      }
      if (filters.verified === 'phone' && !user.phoneVerified) {
        return false;
      }
      return true;
    });
  }, [filters]);

  // Paginer les résultats
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredUsers, currentPage]);

  const resetFilters = () => {
    setFilters({
      search: '',
      role: '',
      verified: ''
    });
    setCurrentPage(1);
  };

  const handleCardClick = (user: User) => {
  setSelectedUser(user);
  setIsDetailModalOpen(true);
};

//pour fermer le modal
const handleCloseDetailModal = () => {
  setIsDetailModalOpen(false);
  setSelectedUser(null);
};

  // Gestion des actions
  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setIsEditModalOpen(true);
  };

  const handleDeleteUser = (userId: string) => {
    setDeletingUserId(userId);
    setIsDeleteModalOpen(true);
  };

  const handleSaveUser = (updatedUser: User) => {
    console.log('Admin sauvegarde utilisateur:', updatedUser);
    // Ici vous enverriez les données à votre API
    setIsEditModalOpen(false);
    setEditingUser(null);
  };

  const handleConfirmDelete = async () => {
    if (!deletingUserId) return;

    setIsDeleting(true);
    try {
      // Simulation d'appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Admin supprime utilisateur:', deletingUserId);
      // Ici vous feriez l'appel API pour supprimer l'utilisateur
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
      setDeletingUserId(null);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Récupérer l'utilisateur en cours de suppression pour afficher ses informations
  const deletingUser = useMemo(() => {
    return deletingUserId ? mockUsers.find(user => user.id === deletingUserId) : null;
  }, [deletingUserId]);

  // Statistiques des utilisateurs
  const userStats = useMemo(() => {
    const total = mockUsers.length;
    const admins = mockUsers.filter(u => u.role === 'admin').length;
    const landlords = mockUsers.filter(u => u.role === 'landlord').length;
    const regularUsers = mockUsers.filter(u => u.role === 'user').length;
    const emailVerified = mockUsers.filter(u => u.emailVerified).length;
    const phoneVerified = mockUsers.filter(u => u.phoneVerified).length;

    return { total, admins, landlords, regularUsers, emailVerified, phoneVerified };
  }, []);

  if (!session || session.user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-xl font-semibold mb-4">Accès non autorisé</h2>
          <p>Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* En-tête */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('admin_users.title')}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('admin_users.subtitle')}
          </p>
        </div>

        {/* Barre d'actions */}
        <div className="flex justify-between items-center mb-6">
          <Link href={URL.admin.dashboard}>
            <Button variant="outline" className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              {t('admin_users.back_dashboard')}
            </Button>
          </Link>
          <Link href={URL.admin.addUser}>
            <Button className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              {t('admin_users.add_user')}
            </Button>
          </Link>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-4">
          <Card className="p-6 text-center bg-white border-l-4 border-l-blue-500">
            <div className="text-2xl font-bold text-gray-900">{userStats.total}</div>
            <div className="text-gray-600">{t('admin_users.stats.total')}</div>
          </Card>
          <Card className="p-6 text-center bg-white border-l-4 border-l-purple-500">
            <div className="text-2xl font-bold text-gray-900">{userStats.admins}</div>
            <div className="text-gray-600">{t('admin_users.stats.admins')}</div>
          </Card>
          <Card className="p-6 text-center bg-white border-l-4 border-l-green-500">
            <div className="text-2xl font-bold text-gray-900">{userStats.landlords}</div>
            <div className="text-gray-600">{t('admin_users.stats.landlords')}</div>
          </Card>
          <Card className="p-6 text-center bg-white border-l-4 border-l-orange-500">
            <div className="text-2xl font-bold text-gray-900">{userStats.regularUsers}</div>
            <div className="text-gray-600">{t('admin_users.stats.users')}</div>
          </Card>
          <Card className="p-6 text-center bg-white border-l-4 border-l-teal-500">
            <div className="text-2xl font-bold text-gray-900">{userStats.emailVerified}</div>
            <div className="text-gray-600">{t('admin_users.stats.email_verified')}</div>
          </Card>
          <Card className="p-6 text-center bg-white border-l-4 border-l-indigo-500">
            <div className="text-2xl font-bold text-gray-900">{userStats.phoneVerified}</div>
            <div className="text-gray-600">{t('admin_users.stats.phone_verified')}</div>
          </Card>
        </div>

        {/* Filtres */}
        <Card className="p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Barre de recherche */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder={t('admin_users.search_placeholder')}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
            </div>

            {/* Bouton Filtres */}
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="h-5 w-5" />
              {t('admin_users.filters.title')}
            </Button>
          </div>

          {/* Filtres détaillés */}
          {showFilters && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t">
              {/* Rôle */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('admin_users.filters.role')}
                </label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                  value={filters.role}
                  onChange={(e) => setFilters({ ...filters, role: e.target.value })}
                >
                  <option value="">{t('admin_users.filters.all_roles')}</option>
                  <option value="admin">{t('admin_users.roles.admin')}</option>
                  <option value="landlord">{t('admin_users.roles.landlord')}</option>
                  <option value="user">{t('admin_users.roles.user')}</option>
                </select>
              </div>

              {/* Vérification */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('admin_users.filters.verification')}
                </label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                  value={filters.verified}
                  onChange={(e) => setFilters({ ...filters, verified: e.target.value })}
                >
                  <option value="">{t('admin_users.filters.all_users')}</option>
                  <option value="email">{t('admin_users.filters.email_verified')}</option>
                  <option value="phone">{t('admin_users.filters.phone_verified')}</option>
                </select>
              </div>

              {/* Boutons d'action */}
              <div className="flex items-end gap-2">
                <Button variant="outline" onClick={resetFilters} className="flex-1">
                  {t('admin_users.reset_filters')}
                </Button>
                <Button onClick={() => setShowFilters(false)} className="flex-1">
                  {t('admin_users.apply_filters')}
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* Résultats */}
        <div className="mb-6 flex justify-between items-center">
          <p className="text-gray-600">
            {t('admin_users.results_count', { count: filteredUsers.length })}
          </p>
        </div>

        {/* Liste des utilisateurs */}
        {paginatedUsers.length > 0 ? (
          <>
            <div className="space-y-4">
              {paginatedUsers.map((user) => (
  <Card 
    key={user.id} 
    className="p-6 hover:shadow-lg transition-shadow duration-200 cursor-pointer"
    onClick={() => handleCardClick(user)}
  >
    <div className="flex items-center justify-between">
      {/* Contenu cliquable */}
      <div 
        className="flex items-center space-x-4 flex-1"
        onClick={(e) => e.stopPropagation()} // Empêche la propagation du clic
      >
        <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
          {user.avatar ? (
            <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full object-cover" />
          ) : (
            <Users className="h-6 w-6 text-gray-600" />
          )}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-lg text-gray-900">{user.name}</h3>
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-sm text-gray-600 mt-1">
            <div className="flex items-center space-x-1">
              <Mail className="h-4 w-4" />
              <span>{user.email}</span>
              {user.emailVerified && (
                <span className="text-green-600" title="Email vérifié">✓</span>
              )}
            </div>
            <div className="flex items-center space-x-1 mt-1 sm:mt-0">
              <Phone className="h-4 w-4" />
              <span>{user.phone}</span>
              {user.phoneVerified && (
                <span className="text-green-600" title="Téléphone vérifié">✓</span>
              )}
            </div>
            <div className="flex items-center space-x-1 mt-1 sm:mt-0">
              <Calendar className="h-4 w-4" />
              <span>{new Date(user.createdAt).toLocaleDateString('fr-FR')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Section non cliquable (badges et menu) */}
      <div 
        className="flex items-center space-x-4"
        onClick={(e) => e.stopPropagation()} // Empêche la propagation du clic
      >
        {/* Badge rôle */}
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${user.role === 'admin'
            ? 'bg-purple-100 text-purple-800'
            : user.role === 'landlord'
              ? 'bg-green-100 text-green-800'
              : 'bg-blue-100 text-blue-800'
          }`}>
          {t(`admin_users.roles.${user.role}`)}
        </span>

        {/* Badge statut */}
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.isActive
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800'
          }`}>
          {user.isActive ? 'Actif' : 'Inactif'}
        </span>

        {/* Menu d'actions */}
        <div className="relative menu-container">
          <button
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            onClick={() => setOpenMenuId(openMenuId === user.id ? null : user.id)}
          >
            <MoreVertical className="h-5 w-5 text-gray-600" />
          </button>

          {openMenuId === user.id && (
            <div className="absolute right-0 top-12 bg-white rounded-lg shadow-lg border py-2 z-10 min-w-[160px]">
              <button
                onClick={() => {
                  handleEditUser(user);
                  setOpenMenuId(null);
                }}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 transition-colors"
              >
                <Edit className="h-4 w-4" />
                {t('common.edit')}
              </button>
              <button
                onClick={() => {
                  handleDeleteUser(user.id);
                  setOpenMenuId(null);
                }}
                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                {t('common.delete')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  </Card>
))}
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalItems={filteredUsers.length}
              itemsPerPage={ITEMS_PER_PAGE}
              onPageChange={handlePageChange}
              className="mt-8"
            />
          </>
        ) : (
          <Card className="text-center py-12">
            <div className="text-gray-500">
              <Users className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {t('admin_users.no_users')}
              </h3>
              <p className="mb-4">{t('admin_users.no_users_description')}</p>
              <Link href={URL.admin.addUser}>
                <Button className="flex items-center gap-2 mx-auto">
                  <UserPlus className="h-5 w-5" />
                  {t('admin_users.add_first_user')}
                </Button>
              </Link>
            </div>
          </Card>
        )}

        {/* Modal de détails de l'utilisateur */}
<UserDetailModal
  user={selectedUser}
  isOpen={isDetailModalOpen}
  onClose={handleCloseDetailModal}
  onEdit={handleEditUser}
  onDelete={handleDeleteUser}
  showActions={true}
/>

        {/* Modal d'édition */}
        <EditUserModal
          user={editingUser}
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingUser(null);
          }}
          onSave={handleSaveUser}
        />

        {/* Modal de suppression */}
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setDeletingUserId(null);
          }}
          onConfirm={handleConfirmDelete}
          isDeleting={isDeleting}
          title={t('admin_users.delete_user')}
          message={
            deletingUser
              ? t('admin_users.delete_confirmation', { name: deletingUser.name })
              : t('admin_users.delete_confirmation_generic')
          }
        />
      </div>
    </div>
  );
}