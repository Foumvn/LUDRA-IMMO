'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useTranslation } from 'react-i18next';
import { 
  MapPin, Star, House, Bath, Square, Wifi, Car, 
  Shield, Trees, Dumbbell, Utensils, Heart, Share2, Phone, 
  Calendar, ChevronLeft, ChevronRight 
} from 'lucide-react';

import { allProperties } from '@/data/propertyData';
import { Property } from '@/types/property';
import { Button } from '@/components/common/ui/Button';
import { Card } from '@/components/common/ui/Card';
import { useFavorites } from '@/hooks/useFavorites';
import Link from 'next/link';
import URL from '@/utilis/url/url_front';
import RouterBack from '@/components/common/ui/RouterBack';
import LoginModal from '@/components/common/modals/LoginModal';

export default function PropertyDetailPage() {
  const params = useParams();
  const { t } = useTranslation();
  const { data: session } = useSession();
  const { favorites, toggleFavorite } = useFavorites();
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [modalActionType, setModalActionType] = useState<'contact' | 'favorite' | 'schedule' | 'general'>('general');

  const propertyId = params?.id as string;

  useEffect(() => {
    if (propertyId) {
      const foundProperty = allProperties.find(p => p.id === parseInt(propertyId));
      setProperty(foundProperty || null);
      setLoading(false);
    }
  }, [propertyId]);

  const handleAction = (actionType: 'contact' | 'favorite' | 'schedule') => {
    if (!session) {
      setModalActionType(actionType);
      setShowLoginModal(true);
      return;
    }

    // Exécuter l'action si l'utilisateur est connecté
    switch (actionType) {
      case 'contact':
        console.log('Contacting owner...');
        break;
      case 'schedule':
        console.log('Scheduling visit...');
        break;
      case 'favorite':
        toggleFavorite(property!.id);
        break;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <Card className="text-center p-8 max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {t('property_details.not_found')}
          </h1>
          <p className="text-gray-600 mb-6">
            {t('property_details.not_found_description')}
          </p>
          <Link href={URL.public.properties}>
            <Button>
              {t('property_details.back_to_properties')}
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  const nextImage = () => {
    if (!property.images) return;
    setCurrentImageIndex(prev => 
      prev === property.images!.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    if (!property.images) return;
    setCurrentImageIndex(prev => 
      prev === 0 ? property.images!.length - 1 : prev - 1
    );
  };

  const isFavorite = favorites.includes(property.id);

  const amenityIcons: { [key: string]: any } = {
    wifi: Wifi,
    parking: Car,
    security: Shield,
    garden: Trees,
    gym: Dumbbell,
    pool: Trees,
    ac: Utensils,
    furnished: Utensils,
    balcony: Trees,
    elevator: Shield
  };

  const currentImage = property.images?.[currentImageIndex] || property.image;

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        <RouterBack />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Galerie d'images */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden">
              <div className="relative">
                <img
                  src={currentImage}
                  alt={t(property.title)}
                  className="w-full h-96 object-cover"
                />
                
                {/* Navigation des images */}
                {property.images && property.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full transition-colors shadow-lg"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full transition-colors shadow-lg"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>
                  </>
                )}

                {/* Indicateur d'images */}
                {property.images && property.images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {property.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-3 h-3 rounded-full transition-all ${
                          index === currentImageIndex 
                            ? 'bg-white scale-110' 
                            : 'bg-white/50 hover:bg-white/80'
                        }`}
                      />
                    ))}
                  </div>
                )}

                {/* Badges */}
                <div className="absolute top-4 left-4 flex space-x-2">
                  {property.featured && (
                    <span className="bg-secondary text-white px-3 py-1 rounded-full text-sm font-medium">
                      {t('featured_section.featured_badge')}
                    </span>
                  )}
                </div>
              </div>

              {/* Miniatures */}
              {property.images && property.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2 p-4">
                  {property.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`relative h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        index === currentImageIndex 
                          ? 'border-primary ring-2 ring-primary/20' 
                          : 'border-transparent hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${t(property.title)} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Informations et actions */}
          <div className="space-y-6">
            <Card className="p-6">
              {/* En-tête */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-secondary font-semibold text-sm uppercase tracking-wide">
                    {t(`property_types.${property.type}`)}
                  </span>
                  <h1 className="text-2xl font-bold text-gray-900 mt-1">
                    {t(property.title)}
                  </h1>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleAction('favorite')}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    aria-label={isFavorite ? t('common.remove_favorite') : t('common.add_favorite')}
                  >
                    <Heart 
                      className={`h-5 w-5 transition-colors ${
                        isFavorite 
                          ? 'text-red-500 fill-current' 
                          : 'text-gray-400 hover:text-red-500'
                      }`} 
                    />
                  </button>
                  <button 
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    aria-label={t('common.share')}
                  >
                    <Share2 className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Localisation et note */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                  <span className="text-sm truncate">{t(property.location)}</span>
                </div>
                <div className="flex items-center bg-primary/10 px-2 py-1 rounded-full">
                  <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                  <span className="font-semibold text-sm">{property.rating}</span>
                </div>
              </div>

              {/* Prix */}
              <div className="text-3xl font-bold text-primary mb-6">
                {property.price.toLocaleString('fr-FR')} FCFA
                <span className="text-sm font-normal text-gray-600 ml-2">
                  {t('featured_section.per_month')}
                </span>
              </div>

              {/* Caractéristiques principales */}
              <div className="grid grid-cols-3 gap-4 py-4 border-y border-gray-200">
                <div className="text-center">
                  <House className="h-6 w-6 mx-auto mb-1 text-gray-600" />
                  <div className="font-semibold text-lg">{property.beds}</div>
                  <div className="text-sm text-gray-600">
                    {t(property.beds > 1 ? 'property_details.beds_plural' : 'property_details.beds')}
                  </div>
                </div>
                <div className="text-center">
                  <Bath className="h-6 w-6 mx-auto mb-1 text-gray-600" />
                  <div className="font-semibold text-lg">{property.baths}</div>
                  <div className="text-sm text-gray-600">
                    {t(property.baths > 1 ? 'property_details.baths_plural' : 'property_details.baths')}
                  </div>
                </div>
                <div className="text-center">
                  <Square className="h-6 w-6 mx-auto mb-1 text-gray-600" />
                  <div className="font-semibold text-lg">{property.area}</div>
                  <div className="text-sm text-gray-600">
                    {t('property_details.area')}
                  </div>
                </div>
              </div>

              {/* Boutons d'action */}
              <div className="space-y-3 mt-6">
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={() => handleAction('contact')}
                >
                  <Phone className="h-5 w-5 mr-2" />
                  {t('property_details.contact_owner')}
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full" 
                  size="lg"
                  onClick={() => handleAction('schedule')}
                >
                  <Calendar className="h-5 w-5 mr-2" />
                  {t('property_details.schedule_visit')}
                </Button>
              </div>
            </Card>

          </div>
        </div>

        {/* Description et détails */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Description */}
          <Card className="p-6 lg:col-span-2">
            <h3 className="text-lg font-semibold mb-4">
              {t('property_details.description')}
            </h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {property.description}
            </p>

            {/* Adresse complète */}
            {property.address && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-2 text-gray-900">
                  {t('property_details.address')}
                </h4>
                <p className="text-gray-700">{property.address}</p>
              </div>
            )}
          </Card>

          {/* Carte (placeholder) */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">
              {t('property_details.location')}
            </h3>
            <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <MapPin className="h-8 w-8 mx-auto mb-2" />
                <p>{t('property_details.map_placeholder')}</p>
                {property.latitude && property.longitude && (
                  <p className="text-xs mt-2">
                    {property.latitude}, {property.longitude}
                  </p>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Modal de connexion externe */}
      <LoginModal 
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        actionType={modalActionType}
      />
    </div>
  );
}