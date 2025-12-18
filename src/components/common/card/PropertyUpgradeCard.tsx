'use client';

import { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin, House, Bath, Square, ArrowRight, Heart, Badge, MoreVertical, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';

import { Property } from '@/types/property';
import { Button } from '@/components/common/ui/Button';
import { Card } from '@/components/common/ui/Card';
import URL from '@/utilis/url/url_front';
import { useSession } from 'next-auth/react';

interface PropertyUpgradeCardProps {
  property: Property;
  index?: number;
  showFavorite?: boolean;
  isFavorite?: boolean;
  onToggleFavorite?: (propertyId: number) => void;
  showStatus?: boolean;
  showActions?: boolean; 
  onEdit?: (property: Property) => void;
  onDelete?: (propertyId: number) => void;
}

const PropertyUpgradeCard = memo(({
  property,
  index = 0,
  showFavorite = false,
  isFavorite = false,
  onToggleFavorite,
  showStatus = false,
  showActions = false,
  onEdit,
  onDelete
}: PropertyUpgradeCardProps) => {
  const { t } = useTranslation();
  const { data: session } = useSession();
  const [isAnimating, setIsAnimating] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);
    
    onToggleFavorite?.(property.id);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowMenu(false);
    onEdit?.(property);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowMenu(false);
    onDelete?.(property.id);
  };

  const statusConfig = {
    available: {
      label: 'property_status.available',
      color: 'bg-green-100 text-green-800 border-green-200',
      icon: '🟢'
    },
    occupied: {
      label: 'property_status.occupied',
      color: 'bg-red-100 text-red-800 border-red-200',
      icon: '🔴'
    },
    pending: {
      label: 'property_status.pending',
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      icon: '🟡'
    }
  };

  const status = statusConfig[property.status];

  return (
    <Card
      className="group overflow-hidden hover:scale-105 transition-all duration-300 animate-fade-in-up bg-white relative"
      style={{ animationDelay: `${index * 0.2}s` }}
    >
      <div className="relative">
        <img
          src={property.image}
          alt={t(property.title)}
          className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-300"
        />

        {/* Badge Vedette */}
        {property.featured && (
          <div className="absolute top-4 left-4 bg-secondary text-white px-3 py-1 rounded-full text-sm font-medium">
            {t('featured_section.featured_badge')}
          </div>
        )}

        {/* Badge Statut (seulement si showStatus=true) */}
        {showStatus && (
          <div className={`absolute top-4 left-4 ${status.color} border px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1`}>
            <span>{status.icon}</span>
            {t(status.label)}
          </div>
        )}

        {/* Bouton Favori */}
        {showFavorite && (
          <button
            onClick={handleFavoriteClick}
            className={`absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 transition-all duration-300 ${
              isAnimating ? 'scale-125' : 'hover:scale-110'
            }`}
            aria-label={isFavorite ? t('common.remove_favorite') : t('common.add_favorite')}
          >
            <Heart
              className={`h-5 w-5 transition-all duration-300 ${
                isFavorite
                  ? 'text-red-500 fill-current scale-110'
                  : 'text-gray-400 hover:text-red-500'
              } ${isAnimating ? 'scale-125' : ''}`}
            />
          </button>
        )}

        {/* Menu d'actions pour landlord/admin */}
        {showActions && (
          <div className="absolute top-4 right-4">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="bg-white/90 backdrop-blur-sm rounded-full p-2 hover:scale-110 transition-all duration-300"
            >
              <MoreVertical className="h-5 w-5 text-gray-600" />
            </button>
            
            {/* Menu déroulant */}
            {showMenu && (
              <div className="absolute right-0 top-12 bg-white rounded-lg shadow-lg border py-2 z-10 min-w-[140px]">
                <button
                  onClick={handleEditClick}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                >
                  <Edit className="h-4 w-4" />
                  {t('common.edit')}
                </button>
                <button
                  onClick={handleDeleteClick}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  {t('common.delete')}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="p-6">
        {/* Type et Prix */}
        <div className="flex justify-between items-start mb-3">
          <span className="text-secondary font-semibold text-sm uppercase tracking-wide">
            {t(`property_types.${property.type}`)}
          </span>
          <span className="text-xl font-bold text-primary">
            {property.price.toLocaleString('fr-FR')} FCFA
            <span className="text-sm font-normal text-gray-600">
              {t('featured_section.per_month')}
            </span>
          </span>
        </div>

        {/* Titre */}
        <h3 className="text-lg font-semibold group-hover:text-primary transition-colors line-clamp-1 min-h-[3.5rem]">
          {t(property.title)}
        </h3>

        {/* Localisation */}
        <div className="flex items-center text-gray-600 mb-2">
          <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
          <span className="text-sm truncate">{t(property.location)}</span>
        </div>

        {/* Caractéristiques */}
        <div className="flex justify-between items-center text-sm text-gray-600 border-t pt-4">
          <div className="flex items-center space-x-1">
            <House className="h-4 w-4" />
            <span>{property.beds} {t(property.beds > 1 ? 'property_details.beds_plural' : 'property_details.beds')}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Bath className="h-4 w-4" />
            <span>{property.baths} {t(property.baths > 1 ? 'property_details.baths_plural' : 'property_details.baths')}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Square className="h-4 w-4" />
            <span>{property.area}{t('property_details.area')}</span>
          </div>
        </div>

        {/* Bouton Voir détails */}
        <Link href={URL.public.propertyDetail(property.id.toString())}>
          <Button className="w-full mt-4 group" variant='primary' size='md'>
            {t('property_details.view_details')}
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>
    </Card>
  );
});

PropertyUpgradeCard.displayName = 'PropertyUpgradeCard';
export default PropertyUpgradeCard;