'use client';

import { useState, useEffect } from 'react';
import { propertyService, Property } from '@/services/propertyService';
import { useAuth } from '@/hooks/useAuth';

export default function PropertyList() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      setLoading(true);
      const data = await propertyService.getAllProperties();
      setProperties(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors du chargement des propriétés');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Nos Propriétés Immobilières
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <div key={property.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            {property.images.length > 0 && (
              <img
                src={property.images[0]}
                alt={property.title}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {property.title}
              </h3>
              <p className="text-gray-600 mb-4 line-clamp-2">
                {property.description}
              </p>
              <div className="flex justify-between items-center mb-4">
                <span className="text-2xl font-bold text-primary-600">
                  {property.price.toLocaleString()} FCFA
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  property.status === 'available' 
                    ? 'bg-green-100 text-green-800'
                    : property.status === 'sold'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {property.status === 'available' ? 'Disponible' :
                   property.status === 'sold' ? 'Vendu' : 'Loué'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <span className="font-medium">Type:</span> {property.type}
                </div>
                <div className="flex items-center">
                  <span className="font-medium">Pièces:</span> {property.rooms}
                </div>
                <div className="flex items-center">
                  <span className="font-medium">Surface:</span> {property.surface}m²
                </div>
                <div className="flex items-center">
                  <span className="font-medium">Ville:</span> {property.city}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {properties.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Aucune propriété disponible pour le moment.</p>
        </div>
      )}
    </div>
  );
}
