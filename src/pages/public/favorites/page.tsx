// app/favorites/page.tsx
'use client';

import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Heart, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

import { allProperties } from '@/data/propertyData';
import PropertyCard from '@/components/common/card/PropertyCard';
import { useFavorites } from '@/hooks/useFavorites';
import { Card } from '@/components/common/ui/Card';
import { Button } from '@/components/common/ui/Button';
import URL from '@/utilis/url/url_front';
import Pagination, { ITEMS_PER_PAGE } from '@/components/common/_others/Pagination';

export default function FavoritesPage() {
  const { t } = useTranslation();
  const { favorites, toggleFavorite } = useFavorites();
  const [currentPage, setCurrentPage] = useState(1);

  const favoriteProperties = allProperties.filter(property => 
    favorites.includes(property.id)
  );

  // Paginer les favoris
  const paginatedFavorites = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return favoriteProperties.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [favoriteProperties, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* En-tête */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link 
              href={URL.public.properties}
              className="inline-flex items-center text-primary hover:text-primary-600 mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('favorites.back_to_properties')}
            </Link>
            <h1 className="text-4xl font-bold text-gray-900">
              {t('favorites.title')}
            </h1>
            <p className="text-xl text-gray-600 mt-2">
              {t('favorites.subtitle')}
            </p>
          </div>
          
          <div className="flex items-center space-x-2 text-primary">
            <Heart className="h-8 w-8" />
            <span className="text-2xl font-bold">{favoriteProperties.length}</span>
          </div>
        </div>

        {/* Liste des favoris */}
        {paginatedFavorites.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedFavorites.map((property, index) => (
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
              totalItems={favoriteProperties.length}
              itemsPerPage={ITEMS_PER_PAGE}
              onPageChange={handlePageChange}
              className="mt-8"
            />
          </>
        ) : (
          <Card className="text-center py-16">
            <div className="text-gray-500">
              <Heart className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-2xl font-semibold mb-4">
                {t('favorites.no_favorites')}
              </h3>
              <p className="text-lg mb-6 max-w-md mx-auto">
                {t('favorites.no_favorites_description')}
              </p>
              <Link href={URL.public.properties}>
                <Button size="lg">
                  {t('favorites.explore_properties')}
                </Button>
              </Link>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}