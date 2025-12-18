'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Home, MapPin, DollarSign, Bed, Bath, Square, 
  Star, Upload, X, Plus, Globe 
} from 'lucide-react';
import { Button } from '@/components/common/ui/Button';
import { Card } from '@/components/common/ui/Card';

interface AddPropertyFormProps {
  onSubmit?: (propertyData: any) => void;
  onCancel?: () => void;
}

const AddPropertyForm = ({ onSubmit, onCancel }: AddPropertyFormProps) => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    title: '',
    type: 'apartment',
    price: '',
    location: '',
    beds: '',
    baths: '',
    area: '',
    address: '',
    description: '',
    latitude: '',
    longitude: '',
    featured: false,
    amenities: [] as string[],
  });

  const propertyTypes = [
    { value: 'all', label: 'property_types.all' },
    { value: 'apartment', label: 'property_types.apartment' },
    { value: 'studio', label: 'property_types.studio' },
    { value: 'house', label: 'property_types.house' },
    { value: 'room', label: 'property_types.room' },
  ];

  const locations = [
    { value: 'douala', label: 'locations.douala' },
    { value: 'yaounde', label: 'locations.yaounde' },
    { value: 'bafoussam', label: 'locations.bafoussam' },
    { value: 'garoua', label: 'locations.garoua' },
    { value: 'ngaoundere', label: 'locations.ngaoundere' },
    { value: 'limbe', label: 'locations.limbe' },
    { value: 'kribi', label: 'locations.kribi' },
    { value: 'bamenda', label: 'locations.bamenda' },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleAmenityChange = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages = Array.from(files);
    setImages(prev => [...prev, ...newImages]);

    // Créer des previews
    newImages.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviews(prev => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Générer un ID unique (simulation)
      const propertyId = Math.floor(Math.random() * 1000) + 1;

      const propertyData = {
        id: propertyId,
        title: formData.title,
        type: formData.type,
        price: parseInt(formData.price),
        location: `locations.${formData.location}`,
        rating: 4.5, // Note par défaut
        image: imagePreviews[0] || '', // Première image comme image principale
        images: imagePreviews,
        beds: parseInt(formData.beds),
        baths: parseInt(formData.baths),
        area: parseInt(formData.area),
        featured: formData.featured,
        description: formData.description,
        address: formData.address,
        latitude: formData.latitude ? parseFloat(formData.latitude) : undefined,
        longitude: formData.longitude ? parseFloat(formData.longitude) : undefined,
        amenities: formData.amenities,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      console.log('Données de la propriété:', propertyData);
      
      // Simulation d'appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onSubmit?.(propertyData);
    } catch (error) {
      console.error('Erreur lors de l\'ajout:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-4 px-4">
      <Card className="p-8 bg-card text-card-foreground shadow-xl">
        <div className="text-center mb-8">
          <p className="text-secondary text-lg font-semibold">
            {t('add_property.subtitle')}
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section Informations de base */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Titre */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-primary mb-2">
                {t('add_property.labels.title')} *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-tertiary text-primary"
                placeholder={t('add_property.placeholders.title')}
              />
            </div>
            {/* Type de propriété */}
            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                <Home className="h-4 w-4 inline mr-2" />
                {t('add_property.labels.type')} *
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-tertiary text-primary"
              >
                {propertyTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {t(type.label)}
                  </option>
                ))}
              </select>
            </div>
            {/* Localisation */}
            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                <MapPin className="h-4 w-4 inline mr-2" />
                {t('add_property.labels.location')} *
              </label>
              <select
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-tertiary text-primary"
              >
                <option value="">{t('add_property.placeholders.select_location')}</option>
                {locations.map(location => (
                  <option key={location.value} value={location.value}>
                    {t(location.label)}
                  </option>
                ))}
              </select>
            </div>
            {/* Prix */}
            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                <DollarSign className="h-4 w-4 inline mr-2" />
                {t('add_property.labels.price')} (FCFA/mois) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
                min="0"
                className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary bg-tertiary text-primary"
                placeholder="250000"
              />
            </div>
            {/* Caractéristiques */}
            <div className="grid grid-cols-3 gap-4 md:col-span-2">
              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  <Bed className="h-4 w-4 inline mr-2" />
                  {t('add_property.labels.beds')} *
                </label>
                <input
                  type="number"
                  name="beds"
                  value={formData.beds}
                  onChange={handleInputChange}
                  required
                  min="0"
                  max="20"
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-tertiary text-primary"
                  placeholder="3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  <Bath className="h-4 w-4 inline mr-2" />
                  {t('add_property.labels.baths')} *
                </label>
                <input
                  type="number"
                  name="baths"
                  value={formData.baths}
                  onChange={handleInputChange}
                  required
                  min="0"
                  max="10"
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-tertiary text-primary"
                  placeholder="2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  <Square className="h-4 w-4 inline mr-2" />
                  {t('add_property.labels.area')} (m²) *
                </label>
                <input
                  type="number"
                  name="area"
                  value={formData.area}
                  onChange={handleInputChange}
                  required
                  min="0"
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-tertiary text-primary"
                  placeholder="120"
                />
              </div>
            </div>
          </div>
          {/* Section Adresse */}
          <div>
            <label className="block text-sm font-medium text-primary mb-2">
              {t('add_property.labels.address')} *
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-tertiary text-primary"
              placeholder={t('add_property.placeholders.address')}
            />
          </div>
          {/* Section Coordonnées GPS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                <Globe className="h-4 w-4 inline mr-2" />
                Latitude
              </label>
              <input
                type="number"
                step="any"
                name="latitude"
                value={formData.latitude}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-tertiary text-primary"
                placeholder="4.0511"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                <Globe className="h-4 w-4 inline mr-2" />
                Longitude
              </label>
              <input
                type="number"
                step="any"
                name="longitude"
                value={formData.longitude}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-tertiary text-primary"
                placeholder="9.7000"
              />
            </div>
          </div>
          {/* Section Description */}
          <div>
            <label className="block text-sm font-medium text-primary mb-2">
              {t('add_property.labels.description')}
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-tertiary text-primary"
              placeholder={t('add_property.placeholders.description')}
            />
          </div>
          {/* Section Images */}
          <div>
            <label className="block text-sm font-medium text-primary mb-2">
              {t('add_property.labels.images')}
            </label>
            <div className="border-2 border-dashed border-primary rounded-lg p-6 text-center bg-tertiary">
              <Upload className="h-12 w-12 text-primary mx-auto mb-4" />
              <p className="text-secondary mb-4">
                {t('add_property.upload_description')}
              </p>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="property-images"
              />
              <label
                htmlFor="property-images"
                className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary-700 cursor-pointer"
              >
                <Plus className="h-4 w-4 mr-2" />
                {t('add_property.upload_button')}
              </label>
            </div>
            {/* Prévisualisation des images */}
            {imagePreviews.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-primary mb-2">
                  {t('add_property.images_preview')} ({imagePreviews.length})
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border border-primary"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-secondary text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                      {index === 0 && (
                        <span className="absolute bottom-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                          Principale
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          {/* Section Vedette */}
          <div className="flex items-center">
            <input
              type="checkbox"
              name="featured"
              checked={formData.featured}
              onChange={handleInputChange}
              className="rounded border-gray-300 text-primary focus:ring-primary"
              id="featured-property"
            />
            <label htmlFor="featured-property" className="ml-2 flex items-center text-sm text-primary">
              <Star className="h-4 w-4 text-yellow-400 mr-1" />
              {t('add_property.labels.featured')}
            </label>
          </div>
          {/* Boutons d'action */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
              className="border border-primary text-primary hover:bg-primary-50"
            >
              {t('common.cancel')}
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-secondary text-secondary-foreground hover:bg-secondary-700 min-w-32"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {t('common.creating')}
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  {t('add_property.submit_button')}
                </>
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AddPropertyForm;