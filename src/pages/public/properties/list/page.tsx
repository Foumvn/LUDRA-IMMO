// app/public/properties/page.tsx
'use client';

import { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';

import { allProperties } from '@/data/propertyData';
import PropertyCard from '@/components/common/card/PropertyCard';
import PropertyFilters from '@/components/common/_others/PropertyFilters';
import { Card } from '@/components/common/ui/Card';
import { Button } from '@/components/common/ui/Button';
import { useFavorites } from '@/hooks/useFavorites';
import Pagination, { ITEMS_PER_PAGE } from '@/components/common/_others/Pagination';

export default function PropertiesListPage() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const { favorites, toggleFavorite } = useFavorites();
  
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    type: '',
    priceRange: '',
    beds: '',
    baths: ''
  });
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);

  // Lire les paramètres d'URL au chargement de la page
  useEffect(() => {
    const urlSearch = searchParams?.get('search') || '';
    const urlLocation = searchParams?.get('location') || '';
    const urlType = searchParams?.get('type') || '';
    const urlPriceRange = searchParams?.get('priceRange') || '';

    setFilters(prev => ({
      ...prev,
      search: urlSearch,
      location: urlLocation,
      type: urlType,
      priceRange: urlPriceRange
    }));
  }, [searchParams]);

  // Filtrer les propriétés - EXCLURE les propriétés occupées
  const filteredProperties = useMemo(() => {
    return allProperties.filter(property => {
      // EXCLURE les propriétés occupées
      if (property.status === 'occupied') {
        return false;
      }

      if (property.status === 'pending') {
        return false;
      }
      
      // Recherche par nom
      if (filters.search && !t(property.title).toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
      
      // Localisation
      if (filters.location && property.location !== `locations.${filters.location}`) {
        return false;
      }
      
      // Type de propriété
      if (filters.type && property.type !== filters.type) {
        return false;
      }
      
      // Prix
      if (filters.priceRange) {
        const [min, max] = filters.priceRange.split('-').map(Number);
        if (max && (property.price < min || property.price > max)) {
          return false;
        }
        if (!max && property.price < min) {
          return false;
        }
      }
      
      // Nombre de chambres
      if (filters.beds) {
        if (filters.beds === '5+' && property.beds < 5) return false;
        if (filters.beds !== '5+' && property.beds !== parseInt(filters.beds)) return false;
      }
      
      // Nombre de salles de bain
      if (filters.baths) {
        if (filters.baths === '4+' && property.baths < 4) return false;
        if (filters.baths !== '4+' && property.baths !== parseInt(filters.baths)) return false;
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
      baths: ''
    });
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Afficher un message spécial si des filtres sont actifs depuis la recherche
  const hasSearchFilters = filters.search || filters.location || filters.type || filters.priceRange;

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* En-tête */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {hasSearchFilters ? t('properties_page.search_results') : t('properties_page.title')}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {hasSearchFilters 
              ? t('properties_page.search_results_description') 
              : t('properties_page.subtitle')
            }
          </p>
          
          {/* Afficher les filtres actifs */}
          {hasSearchFilters && (
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {filters.search && (
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                  Recherche: "{filters.search}"
                </span>
              )}
              {filters.location && (
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                  Localisation: {t(`locations.${filters.location}`)}
                </span>
              )}
              {filters.type && (
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                  Type: {t(`property_types.${filters.type}`)}
                </span>
              )}
              {filters.priceRange && (
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                  Prix: {filters.priceRange}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Filtres réutilisables */}
        <PropertyFilters
          filters={filters}
          onFiltersChange={setFilters}
          onResetFilters={resetFilters}
          showStatusFilter={false}
          showViewToggle={true}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        {/* Résultats */}
        <div className="mb-6 flex justify-between items-center">
          <p className="text-gray-600">
            {t('properties_page.results_count', { count: filteredProperties.length })}
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
                <PropertyCard
                  key={property.id}
                  property={property}
                  index={index}
                  showFavorite={true}
                  isFavorite={favorites.includes(property.id)}
                  onToggleFavorite={toggleFavorite}
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
              <Search className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {t('properties_page.no_results')}
              </h3>
              <p>{t('properties_page.no_results_description')}</p>
              {hasSearchFilters && (
                <Button 
                  onClick={resetFilters}
                  className="mt-4"
                  variant="outline"
                >
                  {t('properties_page.clear_filters')}
                </Button>
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}