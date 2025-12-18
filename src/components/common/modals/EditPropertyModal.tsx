// components/common/modals/PropertyEditModal.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  X, Home, MapPin, DollarSign, Bed, Bath, Square, 
  Star, Upload, Plus, Globe, Edit 
} from 'lucide-react';
import { Property } from '@/types/property';
import { Button } from '@/components/common/ui/Button';

interface EditPropertyModalProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (property: Property) => void;
}

export default function EditPropertyModal({ property, isOpen, onClose, onSave }: EditPropertyModalProps) {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const [formData, setFormData] = useState<Partial<Property>>({
    title: '',
    type: 'apartment',
    price: 0,
    location: '',
    beds: 0,
    baths: 0,
    area: 0,
    address: '',
    description: '',
    latitude: 0,
    longitude: 0,
    featured: false,
    status: 'available'
  });

  const propertyTypes = [
    { value: 'apartment', label: 'property_types.apartment' },
    { value: 'studio', label: 'property_types.studio' },
    { value: 'house', label: 'property_types.house' },
    { value: 'room', label: 'property_types.room' },
    { value: 'loft', label: 'property_types.loft' }
  ];

  useEffect(() => {
    if (property) {
      setFormData({
        title: property.title,
        type: property.type,
        price: property.price,
        location: property.location.replace('locations.', ''),
        beds: property.beds,
        baths: property.baths,
        area: property.area,
        address: property.address || '',
        description: property.description || '',
        latitude: property.latitude || 0,
        longitude: property.longitude || 0,
        featured: property.featured || false,
        status: property.status,
      });
      
      // Réinitialiser les images
      setImages([]);
      setImagePreviews([]);
    }
  }, [property]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
               type === 'number' ? parseFloat(value) : value
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

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!property) return;

    setIsSubmitting(true);

    try {
      const updatedProperty: Property = {
        ...property,
        ...formData,
        location: `locations.${formData.location}`,
        // Garder l'image originale si aucune nouvelle image n'est uploadée
        image: imagePreviews[0] || property.image,
        images: imagePreviews.length > 0 ? imagePreviews : property.images,
        updatedAt: new Date().toISOString(),
      };

      console.log('Propriété mise à jour:', updatedProperty);
      
      // Simulation d'appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onSave(updatedProperty);
    } catch (error) {
      console.error('Erreur lors de la modification:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !property) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* En-tête */}
        <div className="flex justify-between items-center p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <Edit className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-semibold text-primary">
              {t('my_properties.edit_property')}
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
                className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white text-primary"
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
                className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white text-primary"
              >
                {propertyTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {t(type.label)}
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
                className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary bg-white text-primary"
                placeholder="250000"
              />
            </div>
          </div>

          {/* Caractéristiques */}
          <div className="grid grid-cols-3 gap-4">
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
                className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white text-primary"
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
                className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white text-primary"
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
                className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white text-primary"
                placeholder="120"
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
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white text-primary"
              placeholder={t('add_property.placeholders.description')}
            />
          </div>

          {/* Section Images */}
          <div>
            <label className="block text-sm font-medium text-primary mb-2">
              {t('add_property.labels.images')}
            </label>
            
            {/* Images existantes */}
            {property.images && property.images.length > 0 && (
              <div className="mb-4">
                <p className="text-sm text-primary mb-2">
                  Images actuelles ({property.images.length})
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {property.images.map((img, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={img}
                        alt={`Image ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border border-border"
                      />
                      {index === 0 && (
                        <span className="absolute bottom-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded">
                          Principale
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upload de nouvelles images */}
            <div className="border-2 border-dashed border-primary rounded-lg p-6 text-center bg-gray-50">
              <Upload className="h-12 w-12 text-primary mx-auto mb-4" />
              <p className="text-secondary mb-4">
                {t('add_property.upload_description')}
              </p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={triggerFileInput}
                className="border border-primary text-primary hover:bg-primary-50"
              >
                <Plus className="h-4 w-4 mr-2" />
                {t('add_property.upload_button')}
              </Button>
            </div>

            {/* Prévisualisation des nouvelles images */}
            {imagePreviews.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-primary mb-2">
                  Nouvelles images ({imagePreviews.length})
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`Nouvelle image ${index + 1}`}
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
                        <span className="absolute bottom-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded">
                          Nouvelle principale
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