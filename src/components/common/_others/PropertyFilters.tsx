// components/common/PropertyFilters.tsx
'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Filter, MapPin, Home, Bath, DollarSign, Grid, List } from 'lucide-react';
import { Button } from '@/components/common/ui/Button';
import { Card } from '@/components/common/ui/Card';

// Définir FilterState avec status optionnel
interface FilterState {
  search: string;
  location: string;
  type: string;
  priceRange: string;
  beds: string;
  baths: string;
  status?: string; // status est optionnel
}

interface PropertyFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onResetFilters: () => void;
  showStatusFilter?: boolean;
  searchPlaceholder?: string;
  showViewToggle?: boolean;
  viewMode?: 'grid' | 'list';
  onViewModeChange?: (mode: 'grid' | 'list') => void;
}

export default function PropertyFilters({
  filters,
  onFiltersChange,
  onResetFilters,
  showStatusFilter = false,
  searchPlaceholder = 'properties_page.search_placeholder',
  showViewToggle = false,
  viewMode = 'grid',
  onViewModeChange
}: PropertyFiltersProps) {
  const { t } = useTranslation();
  const [showFilters, setShowFilters] = useState(false);

  const filterOptions = {
    status: [
      { value: '', label: 'filters.labels.all_status' },
      { value: 'available', label: 'property_status.available' },
      { value: 'occupied', label: 'property_status.occupied' },
      { value: 'pending', label: 'property_status.pending' }
    ],
    locations: [
      { value: '', label: 'filters.labels.all_locations' },
      { value: 'douala', label: 'locations.douala' },
      { value: 'yaounde', label: 'locations.yaounde' },
      { value: 'bafoussam', label: 'locations.bafoussam' },
      { value: 'garoua', label: 'locations.garoua' },
      { value: 'ngaoundere', label: 'locations.ngaoundere' },
      { value: 'limbe', label: 'locations.limbe' },
      { value: 'kribi', label: 'locations.kribi' },
      { value: 'bamenda', label: 'locations.bamenda' }
    ],
    propertyTypes: [
      { value: '', label: 'filters.labels.all_types' },
      { value: 'apartment', label: 'property_types.apartment' },
      { value: 'studio', label: 'property_types.studio' },
      { value: 'house', label: 'property_types.house' },
      { value: 'room', label: 'property_types.room' },
      { value: 'loft', label: 'property_types.loft' }
    ],
    priceRanges: [
      { value: '', label: 'filters.labels.all_prices' },
      { value: '0-100000', label: 'filters.price_ranges.0_500' },
      { value: '100000-300000', label: 'filters.price_ranges.500_800' },
      { value: '300000-600000', label: 'filters.price_ranges.800_1200' },
      { value: '600000-1000000', label: 'filters.price_ranges.1200_2000' },
      { value: '1000000+', label: 'filters.price_ranges.2000_plus' }
    ],
    beds: [
      { value: '', label: 'filters.labels.any_beds' },
      { value: '1', label: 'filters.beds.1' },
      { value: '2', label: 'filters.beds.2' },
      { value: '3', label: 'filters.beds.3' },
      { value: '4', label: 'filters.beds.4' },
      { value: '5+', label: 'filters.beds.5_plus' }
    ],
    baths: [
      { value: '', label: 'filters.labels.any_baths' },
      { value: '1', label: 'filters.baths.1' },
      { value: '2', label: 'filters.baths.2' },
      { value: '3', label: 'filters.baths.3' },
      { value: '4+', label: 'filters.baths.4_plus' }
    ]
  };

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const applyFilters = () => {
    setShowFilters(false);
  };

  return (
    <Card className="p-6 mb-8">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Barre de recherche */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder={t(searchPlaceholder)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
        </div>

        {/* Bouton Filtres */}
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2"
        >
          <Filter className="h-5 w-5" />
          {t('properties_page.filters')}
        </Button>

        {/* Boutons de vue (optionnel) */}
        {showViewToggle && onViewModeChange && (
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'grid' ? 'primary' : 'outline'}
              onClick={() => onViewModeChange('grid')}
              className="flex items-center gap-2"
            >
              <Grid className="h-5 w-5" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'primary' : 'outline'}
              onClick={() => onViewModeChange('list')}
              className="flex items-center gap-2"
            >
              <List className="h-5 w-5" />
            </Button>
          </div>
        )}
      </div>

      {/* Filtres détaillés */}
      {showFilters && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-6 border-t">
          {/* Localisation */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="h-4 w-4 inline mr-1" />
              {t('filters.labels.location')}
            </label>
            <select
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
            >
              {filterOptions.locations.map(option => (
                <option key={option.value} value={option.value}>
                  {t(option.label)}
                </option>
              ))}
            </select>
          </div>

          {/* Type de propriété */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Home className="h-4 w-4 inline mr-1" />
              {t('filters.labels.type')}
            </label>
            <select
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
            >
              {filterOptions.propertyTypes.map(option => (
                <option key={option.value} value={option.value}>
                  {t(option.label)}
                </option>
              ))}
            </select>
          </div>

          {/* Prix */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <DollarSign className="h-4 w-4 inline mr-1" />
              {t('filters.labels.price')}
            </label>
            <select
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
              value={filters.priceRange}
              onChange={(e) => handleFilterChange('priceRange', e.target.value)}
            >
              {filterOptions.priceRanges.map(option => (
                <option key={option.value} value={option.value}>
                  {t(option.label)}
                </option>
              ))}
            </select>
          </div>

          {/* Statut (conditionnel) */}
          {showStatusFilter && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('filters.labels.status')}
              </label>
              <select
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                value={filters.status || ''}
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                {filterOptions.status.map(option => (
                  <option key={option.value} value={option.value}>
                    {t(option.label)}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Chambres et Salles de bain */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('filters.labels.beds')}
              </label>
              <select
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                value={filters.beds}
                onChange={(e) => handleFilterChange('beds', e.target.value)}
              >
                {filterOptions.beds.map(option => (
                  <option key={option.value} value={option.value}>
                    {t(option.label)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Bath className="h-4 w-4 inline mr-1" />
                {t('filters.labels.baths')}
              </label>
              <select
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                value={filters.baths}
                onChange={(e) => handleFilterChange('baths', e.target.value)}
              >
                {filterOptions.baths.map(option => (
                  <option key={option.value} value={option.value}>
                    {t(option.label)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="lg:col-span-4 flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={onResetFilters}>
              {t('properties_page.reset_filters')}
            </Button>
            <Button onClick={applyFilters}>
              {t('properties_page.apply_filters')}
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}