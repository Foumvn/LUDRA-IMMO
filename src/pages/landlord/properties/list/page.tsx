'use client';

import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Home } from 'lucide-react';
import { useSession } from 'next-auth/react';

import { allProperties } from '@/data/propertyData';
import PropertyUpgradeCard from '@/components/common/card/PropertyUpgradeCard';
import PropertyFilters from '@/components/common/_others/PropertyFilters';
import EditPropertyModal from '@/components/common/modals/EditPropertyModal';
import DeletePropertyModal from '@/components/common/modals/DeletePropertyModal';
import { Button } from '@/components/common/ui/Button';
import { Card } from '@/components/common/ui/Card';
import { Property } from '@/types/property';
import Pagination, { ITEMS_PER_PAGE } from '@/components/common/_others/Pagination';

type MyPropertiesFilters = {
  search: string;
  location: string;
  type: string;
  priceRange: string;
  beds: string;
  baths: string;
  status?: string;
};

export default function MyPropertiesPage() {
  const { t } = useTranslation();
  const { data: session } = useSession();
  
  const [filters, setFilters] = useState<MyPropertiesFilters>({
    search: '',
    location: '',
    type: '',
    priceRange: '',
    beds: '',
    baths: '',
    status: ''
  });
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [deletingPropertyId, setDeletingPropertyId] = useState<number | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Filtrer les propriétés de l'utilisateur connecté
  const myProperties = useMemo(() => {
    if (!session?.user?.id) return [];
    return allProperties.filter(property => property.landlordId === session.user.id);
  }, [session]);

  // Appliquer les filtres supplémentaires
  const filteredProperties = useMemo(() => {
    return myProperties.filter(property => {
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
      return true;
    });
  }, [myProperties, filters, t]);

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
      status: ''
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
    // Ici, vous intégrerez votre logique de sauvegarde (API, etc.)
    console.log('Sauvegarde de la propriété:', updatedProperty);
    setIsEditModalOpen(false);
    setEditingProperty(null);
    // Ajouter une notification de succès
  };

  const handleConfirmDelete = () => {
    if (deletingPropertyId) {
      // Ici, vous intégrerez votre logique de suppression (API, etc.)
      console.log('Suppression de la propriété:', deletingPropertyId);
      setIsDeleteModalOpen(false);
      setDeletingPropertyId(null);
      // Ajouter une notification de succès
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll vers le haut quand on change de page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Statistiques des propriétés
  const propertyStats = useMemo(() => {
    const total = myProperties.length;
    const available = myProperties.filter(p => p.status === 'available').length;
    const occupied = myProperties.filter(p => p.status === 'occupied').length;
    const pending = myProperties.filter(p => p.status === 'pending').length;
    
    return { total, available, occupied, pending };
  }, [myProperties]);

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-xl font-semibold mb-4">Connexion requise</h2>
          <p>Veuillez vous connecter pour voir vos propriétés.</p>
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
            {t('my_properties.title')}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('my_properties.subtitle')}
          </p>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <Card className="p-6 text-center bg-white border-l-4 border-l-blue-500">
            <div className="text-2xl font-bold text-gray-900">{propertyStats.total}</div>
            <div className="text-gray-600">{t('my_properties.stats.total')}</div>
          </Card>
          <Card className="p-6 text-center bg-white border-l-4 border-l-green-500">
            <div className="text-2xl font-bold text-gray-900">{propertyStats.available}</div>
            <div className="text-gray-600">{t('my_properties.stats.available')}</div>
          </Card>
          <Card className="p-6 text-center bg-white border-l-4 border-l-red-500">
            <div className="text-2xl font-bold text-gray-900">{propertyStats.occupied}</div>
            <div className="text-gray-600">{t('my_properties.stats.occupied')}</div>
          </Card>
          <Card className="p-6 text-center bg-white border-l-4 border-l-yellow-500">
            <div className="text-2xl font-bold text-gray-900">{propertyStats.pending}</div>
            <div className="text-gray-600">{t('my_properties.stats.pending')}</div>
          </Card>
        </div>

        {/* Filtres réutilisables */}
        <PropertyFilters
          filters={filters}
          onFiltersChange={setFilters}
          onResetFilters={resetFilters}
          showStatusFilter={true}
          searchPlaceholder="my_properties.search_placeholder"
          showViewToggle={true}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        {/* Résultats */}
        <div className="mb-6 flex justify-between items-center">
          <p className="text-gray-600">
            {t('my_properties.results_count', { count: filteredProperties.length })}
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
                {t('my_properties.no_properties')}
              </h3>
              <p className="mb-4">{t('my_properties.no_properties_description')}</p>
              <Button className="flex items-center gap-2 mx-auto">
                <Plus className="h-5 w-5" />
                {t('my_properties.add_first_property')}
              </Button>
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