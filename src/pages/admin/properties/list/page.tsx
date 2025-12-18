// app/admin/properties/page.tsx
'use client';

import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSession } from 'next-auth/react';
import { Plus, Home, Building2 } from 'lucide-react';

import { allProperties } from '@/data/propertyData';
import PropertyUpgradeCard from '@/components/common/card/PropertyUpgradeCard';
import PropertyFilters from '@/components/common/_others/PropertyFilters';
import EditPropertyModal from '@/components/common/modals/EditPropertyModal';
import DeletePropertyModal from '@/components/common/modals/DeletePropertyModal';
import { Button } from '@/components/common/ui/Button';
import { Card } from '@/components/common/ui/Card';
import { Property } from '@/types/property';
import Link from 'next/link';
import URL from '@/utilis/url/url_front';
import Pagination, { ITEMS_PER_PAGE } from '@/components/common/_others/Pagination';

type AdminPropertiesFilters = {
  search: string;
  location: string;
  type: string;
  priceRange: string;
  beds: string;
  baths: string;
  status: string;
  landlord: string;
};

export default function AllPropertiesPage() {
  const { t } = useTranslation();
  const { data: session } = useSession();
  
  const [filters, setFilters] = useState<AdminPropertiesFilters>({
    search: '',
    location: '',
    type: '',
    priceRange: '',
    beds: '',
    baths: '',
    status: '',
    landlord: ''
  });
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [deletingPropertyId, setDeletingPropertyId] = useState<number | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Récupérer tous les propriétaires uniques
  const landlords = useMemo(() => {
    const landlordIds = [...new Set(allProperties.map(p => p.landlordId))];
    return landlordIds.map(id => ({
      id,
      name: `Propriétaire ${id}`
    }));
  }, []);

  // Appliquer les filtres
  const filteredProperties = useMemo(() => {
    return allProperties.filter(property => {
      if (filters.search && !t(property.title).toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
      if (filters.location && property.location !== `locations.${filters.location}`) {
        return false;
      }
      if (filters.type && property.type !== filters.type) {
        return false;
      }
      if (filters.priceRange) {
        const [min, max] = filters.priceRange.split('-').map(Number);
        if (max && (property.price < min || property.price > max)) {
          return false;
        }
        if (!max && property.price < min) {
          return false;
        }
      }
      if (filters.beds) {
        if (filters.beds === '5+' && property.beds < 5) return false;
        if (filters.beds !== '5+' && property.beds !== parseInt(filters.beds)) return false;
      }
      if (filters.baths) {
        if (filters.baths === '4+' && property.baths < 4) return false;
        if (filters.baths !== '4+' && property.baths !== parseInt(filters.baths)) return false;
      }
      if (filters.status && property.status !== filters.status) {
        return false;
      }
      if (filters.landlord && property.landlordId !== parseInt(filters.landlord)) {
        return false;
      }
      return true;
    });
  }, [filters, t]);

  // Paginer les résultats
  const paginatedProperties = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProperties.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredProperties, currentPage]);

  const resetFilters = () => {
    setFilters({
      search: '',
      location: '',
      type: '',
      priceRange: '',
      beds: '',
      baths: '',
      status: '',
      landlord: ''
    });
    setCurrentPage(1);
  };

  // Gestion des actions
  const handleEditProperty = (property: Property) => {
    setEditingProperty(property);
    setIsEditModalOpen(true);
  };

  const handleDeleteProperty = (propertyId: number) => {
    setDeletingPropertyId(propertyId);
    setIsDeleteModalOpen(true);
  };

  const handleSaveProperty = (updatedProperty: Property) => {
    console.log('Admin sauvegarde propriété:', updatedProperty);
    setIsEditModalOpen(false);
    setEditingProperty(null);
  };

  const handleConfirmDelete = () => {
    if (deletingPropertyId) {
      console.log('Admin supprime propriété:', deletingPropertyId);
      setIsDeleteModalOpen(false);
      setDeletingPropertyId(null);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Statistiques des propriétés
  const propertyStats = useMemo(() => {
    const total = allProperties.length;
    const available = allProperties.filter(p => p.status === 'available').length;
    const occupied = allProperties.filter(p => p.status === 'occupied').length;
    const pending = allProperties.filter(p => p.status === 'pending').length;
    
    return { total, available, occupied, pending };
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
            {t('admin_properties.title')}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('admin_properties.subtitle')}
          </p>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6 text-center bg-white border-l-4 border-l-blue-500">
            <div className="text-2xl font-bold text-gray-900">{propertyStats.total}</div>
            <div className="text-gray-600">{t('admin_properties.stats.total')}</div>
          </Card>
          <Card className="p-6 text-center bg-white border-l-4 border-l-green-500">
            <div className="text-2xl font-bold text-gray-900">{propertyStats.available}</div>
            <div className="text-gray-600">{t('admin_properties.stats.available')}</div>
          </Card>
          <Card className="p-6 text-center bg-white border-l-4 border-l-red-500">
            <div className="text-2xl font-bold text-gray-900">{propertyStats.occupied}</div>
            <div className="text-gray-600">{t('admin_properties.stats.occupied')}</div>
          </Card>
          <Card className="p-6 text-center bg-white border-l-4 border-l-yellow-500">
            <div className="text-2xl font-bold text-gray-900">{propertyStats.pending}</div>
            <div className="text-gray-600">{t('admin_properties.stats.pending')}</div>
          </Card>
        </div>

        {/* Barre d'actions */}
        <div className="flex justify-between items-center mb-6">
          <Link href={URL.admin.dashboard}>
            <Button variant="outline" className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              {t('admin_users.back_dashboard')}
            </Button>
          </Link>

          {/* Filtre par propriétaire */}
            <div className="w-full lg:w-64">
              <select
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                value={filters.landlord}
                onChange={(e) => setFilters({ ...filters, landlord: e.target.value })}
              >
                <option value="">{t('admin_properties.all_landlords')}</option>
                {landlords.map(landlord => (
                  <option key={landlord.id} value={landlord.id}>
                    {landlord.name}
                  </option>
                ))}
              </select>
            </div>
          <Link href={URL.landlord.addProperty}>
            <Button className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              {t('admin_properties.add_property')}
            </Button>
          </Link>
        </div>

          {/* Filtres avancés */}
          <PropertyFilters
            filters={filters}
            onFiltersChange={setFilters}
            onResetFilters={resetFilters}
            showStatusFilter={true}
            searchPlaceholder="admin_properties.search_placeholder"
            showViewToggle={true}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />

        {/* Résultats */}
        <div className="mb-6 flex justify-between items-center">
          <p className="text-gray-600">
            {t('admin_properties.results_count', { count: filteredProperties.length })}
          </p>
        </div>

        {/* Liste des propriétés */}
        {paginatedProperties.length > 0 ? (
          <>
            <div className={`
              ${viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
                : 'space-y-6'
              }
            `}>
              {paginatedProperties.map((property, index) => (
                <PropertyUpgradeCard
                  key={property.id}
                  property={property}
                  index={index}
                  showFavorite={false}
                  showStatus={true}
                  showActions={true}
                  onEdit={handleEditProperty}
                  onDelete={handleDeleteProperty}
                />
              ))}
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalItems={filteredProperties.length}
              itemsPerPage={ITEMS_PER_PAGE}
              onPageChange={handlePageChange}
              className="mt-8"
            />
          </>
        ) : (
          <Card className="text-center py-12">
            <div className="text-gray-500">
              <Home className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {t('admin_properties.no_properties')}
              </h3>
              <p className="mb-4">{t('admin_properties.no_properties_description')}</p>
            </div>
          </Card>
        )}

        {/* Modals */}
        <EditPropertyModal
          property={editingProperty}
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingProperty(null);
          }}
          onSave={handleSaveProperty}
        />

        <DeletePropertyModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setDeletingPropertyId(null);
          }}
          onConfirm={handleConfirmDelete}
        />
      </div>
    </div>
  );
}