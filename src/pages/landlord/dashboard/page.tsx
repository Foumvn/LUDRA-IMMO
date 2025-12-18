'use client';

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSession } from 'next-auth/react';
import {
  Home, TrendingUp, Users, DollarSign,
  PieChart, BarChart3, MapPin, Plus
} from 'lucide-react';

import { allProperties } from '@/data/propertyData';
import { Card } from '@/components/common/ui/Card';
import { Button } from '@/components/common/ui/Button';
import URL from '@/utilis/url/url_front';
import Link from 'next/link';

export default function DashboardLandlordPage() {
  const { t } = useTranslation();
  const { data: session } = useSession();

  // Filtrer les propriétés de l'utilisateur connecté
  const myProperties = useMemo(() => {
    if (!session?.user?.id) return [];
    return allProperties.filter(property => property.landlordId === session.user.id);
  }, [session]);

  // Statistiques détaillées
  const propertyStats = useMemo(() => {
    const total = myProperties.length;
    const available = myProperties.filter(p => p.status === 'available').length;
    const occupied = myProperties.filter(p => p.status === 'occupied').length;
    const pending = myProperties.filter(p => p.status === 'pending').length;

    // Calcul des pourcentages
    const availablePercentage = total > 0 ? (available / total) * 100 : 0;
    const occupiedPercentage = total > 0 ? (occupied / total) * 100 : 0;
    const pendingPercentage = total > 0 ? (pending / total) * 100 : 0;

    // Statistiques par type de propriété
    const typesStats = myProperties.reduce((acc, property) => {
      acc[property.type] = (acc[property.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Statistiques par localisation
    const locationStats = myProperties.reduce((acc, property) => {
      const location = property.location.replace('locations.', '');
      acc[location] = (acc[location] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Revenu mensuel estimé
    const monthlyRevenue = myProperties
      .filter(p => p.status === 'occupied')
      .reduce((sum, property) => sum + property.price, 0);

    // Prix moyen
    const averagePrice = total > 0 ? myProperties.reduce((sum, p) => sum + p.price, 0) / total : 0;

    // Taux d'occupation
    const occupancyRate = total > 0 ? (occupied / total) * 100 : 0;

    return {
      total,
      available,
      occupied,
      pending,
      availablePercentage,
      occupiedPercentage,
      pendingPercentage,
      typesStats,
      locationStats,
      monthlyRevenue,
      averagePrice,
      occupancyRate
    };
  }, [myProperties]);

  // Données pour le graphique circulaire
  const pieChartData = [
    { name: 'Disponible', value: propertyStats.available, color: '#10B981' },
    { name: 'Occupé', value: propertyStats.occupied, color: '#EF4444' },
    { name: 'En attente', value: propertyStats.pending, color: '#F59E0B' }
  ];

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-xl font-semibold mb-4">Connexion requise</h2>
          <p>Veuillez vous connecter pour accéder à votre tableau de bord.</p>
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
            {t('dashboard.welcome')}, {session.user.name}!
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('dashboard.subtitle')}
          </p>
        </div>

        {/* Actions rapides */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {t('dashboard.overview')}
            </h2>
            <p className="text-gray-600">
              {t('dashboard.overview_subtitle')}
            </p>
          </div>
          <div className="flex gap-4">
            <Link href={URL.landlord.properties}>
              <Button variant="outline" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                {t('dashboard.view_properties')}
              </Button>
            </Link>
            <Link href={URL.landlord.addProperty}>
              <Button className="flex items-center gap-2 bg-primary hover:bg-primary-700">
                <Plus className="h-4 w-4" />
                {t('dashboard.add_property')}
              </Button>
            </Link>
          </div>
        </div>

        {/* Statistiques principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 bg-white border-l-4 border-l-blue-500 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t('dashboard.stats.total_properties')}</p>
                <p className="text-2xl font-bold text-gray-900">{propertyStats.total}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {t('dashboard.stats.properties_managed')}
                </p>
              </div>
              <Home className="h-8 w-8 text-blue-500" />
            </div>
          </Card>

          <Card className="p-6 bg-white border-l-4 border-l-green-500 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t('dashboard.stats.monthly_revenue')}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {propertyStats.monthlyRevenue.toLocaleString('fr-FR')} FCFA
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {t('dashboard.stats.from_occupied')}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </Card>

          <Card className="p-6 bg-white border-l-4 border-l-purple-500 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t('dashboard.stats.average_price')}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(propertyStats.averagePrice).toLocaleString('fr-FR')} FCFA
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {t('dashboard.stats.per_month')}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </Card>

          <Card className="p-6 bg-white border-l-4 border-l-orange-500 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t('dashboard.stats.occupancy_rate')}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(propertyStats.occupancyRate)}%
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {propertyStats.occupied} {t('dashboard.stats.occupied_properties')}
                </p>
              </div>
              <Users className="h-8 w-8 text-orange-500" />
            </div>
          </Card>
        </div>

        {/* Graphiques et statistiques détaillées */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Graphique circulaire - Statuts */}
          <Card className="p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <PieChart className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">{t('dashboard.charts.status_distribution')}</h3>
            </div>
            <div className="space-y-4">
              {pieChartData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm font-medium">{item.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold">{item.value}</span>
                    <span className="text-sm text-gray-500 ml-2">
                      ({Math.round((item.value / propertyStats.total) * 100)}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Répartition par type */}
          <Card className="p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <Home className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">{t('dashboard.charts.type_distribution')}</h3>
            </div>
            <div className="space-y-4">
              {Object.entries(propertyStats.typesStats).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between">
                  <span className="text-sm font-medium capitalize">
                    {t(`property_types.${type}`)}
                  </span>
                  <div className="text-right">
                    <span className="font-semibold">{count}</span>
                    <span className="text-sm text-gray-500 ml-2">
                      ({Math.round((count / propertyStats.total) * 100)}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Répartition par localisation */}
          <Card className="p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <MapPin className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">{t('dashboard.charts.location_distribution')}</h3>
            </div>
            <div className="space-y-4">
              {Object.entries(propertyStats.locationStats).map(([location, count]) => (
                <div key={location} className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    {t(`locations.${location}`)}
                  </span>
                  <div className="text-right">
                    <span className="font-semibold">{count}</span>
                    <span className="text-sm text-gray-500 ml-2">
                      ({Math.round((count / propertyStats.total) * 100)}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Indicateurs de performance */}
          <Card className="p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">{t('dashboard.charts.performance_metrics')}</h3>
            </div>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>{t('dashboard.metrics.availability_rate')}</span>
                  <span className="font-semibold">{Math.round(propertyStats.availablePercentage)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${propertyStats.availablePercentage}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>{t('dashboard.metrics.occupancy_rate')}</span>
                  <span className="font-semibold">{Math.round(propertyStats.occupiedPercentage)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-red-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${propertyStats.occupiedPercentage}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>{t('dashboard.metrics.pending_rate')}</span>
                  <span className="font-semibold">{Math.round(propertyStats.pendingPercentage)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${propertyStats.pendingPercentage}%` }}
                  />
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Propriétés récentes */}
        <div className="mt-12 py-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {t('dashboard.recent_properties')}
            </h2>
            <Link href={URL.landlord.properties}>
              <Button variant="outline" size="sm">
                {t('dashboard.view_all_properties')}
              </Button>
            </Link>
          </div>

          {myProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myProperties.slice(0, 3).map((property, index) => (
                <Card key={property.id} className="overflow-hidden">
                  <img
                    src={property.image}
                    alt={property.title}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-1">
                      {t(property.title)}
                    </h3>
                    <div className="flex justify-between items-center text-sm text-gray-600">
                      <span>{property.beds} {t('property_details.beds')}</span>
                      <span>{property.baths} {t('property_details.baths')}</span>
                      <span>{property.area}m²</span>
                    </div>
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-lg font-bold text-primary">
                        {property.price.toLocaleString('fr-FR')} FCFA
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs ${property.status === 'available'
                          ? 'bg-green-100 text-green-800'
                          : property.status === 'occupied'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                        {t(`property_status.${property.status}`)}
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="text-center py-12">
              <div className="text-gray-500">
                <Home className="h-12 w-12 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  {t('dashboard.no_properties_yet')}
                </h3>
                <p className="mb-4">{t('dashboard.add_first_property_description')}</p>
                <Button className="flex items-center gap-2 mx-auto">
                  <Plus className="h-5 w-5" />
                  {t('dashboard.add_first_property')}
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}