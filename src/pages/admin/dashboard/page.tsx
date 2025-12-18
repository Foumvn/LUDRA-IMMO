// app/admin/dashboard/page.tsx
'use client';

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSession } from 'next-auth/react';
import {
  Home, TrendingUp, Users, DollarSign, Building2,
  PieChart, BarChart3, MapPin, Plus, Shield
} from 'lucide-react';

import { allProperties } from '@/data/propertyData';
import { mockUsers } from '@/data/users';
import { Card } from '@/components/common/ui/Card';
import { Button } from '@/components/common/ui/Button';
import URL from '@/utilis/url/url_front';
import Link from 'next/link';

export default function DashboardAdminPage() {
  const { t } = useTranslation();
  const { data: session } = useSession();

  // Statistiques détaillées
  const stats = useMemo(() => {
    const totalProperties = allProperties.length;
    const totalUsers = mockUsers.length;
    const totalLandlords = mockUsers.filter(user => user.role === 'landlord').length;
    const totalRegularUsers = mockUsers.filter(user => user.role === 'user').length;

    // Statistiques propriétés
    const availableProperties = allProperties.filter(p => p.status === 'available').length;
    const occupiedProperties = allProperties.filter(p => p.status === 'occupied').length;
    const pendingProperties = allProperties.filter(p => p.status === 'pending').length;

    // Calcul des pourcentages
    const availablePercentage = totalProperties > 0 ? (availableProperties / totalProperties) * 100 : 0;
    const occupiedPercentage = totalProperties > 0 ? (occupiedProperties / totalProperties) * 100 : 0;
    const pendingPercentage = totalProperties > 0 ? (pendingProperties / totalProperties) * 100 : 0;

    // Revenu mensuel estimé
    const monthlyRevenue = allProperties
      .filter(p => p.status === 'occupied')
      .reduce((sum, property) => sum + property.price, 0);

    // Prix moyen
    const averagePrice = totalProperties > 0 ? allProperties.reduce((sum, p) => sum + p.price, 0) / totalProperties : 0;

    // Statistiques par type de propriété
    const typesStats = allProperties.reduce((acc, property) => {
      acc[property.type] = (acc[property.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Statistiques par localisation
    const locationStats = allProperties.reduce((acc, property) => {
      const location = property.location.replace('locations.', '');
      acc[location] = (acc[location] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalProperties,
      totalUsers,
      totalLandlords,
      totalRegularUsers,
      availableProperties,
      occupiedProperties,
      pendingProperties,
      availablePercentage,
      occupiedPercentage,
      pendingPercentage,
      monthlyRevenue,
      averagePrice,
      typesStats,
      locationStats
    };
  }, []);

  // Données pour le graphique circulaire
  const pieChartData = [
    { name: 'Disponible', value: stats.availableProperties, color: '#10B981' },
    { name: 'Occupé', value: stats.occupiedProperties, color: '#EF4444' },
    { name: 'En attente', value: stats.pendingProperties, color: '#F59E0B' }
  ];

  if (!session || session.user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-xl font-semibold mb-4">Accès non autorisé</h2>
          <p>Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
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
            {t('admin_dashboard.welcome')}, {session.user.name}!
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('admin_dashboard.subtitle')}
          </p>
        </div>

        {/* Actions rapides */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {t('admin_dashboard.overview')}
            </h2>
            <p className="text-gray-600">
              {t('admin_dashboard.overview_subtitle')}
            </p>
          </div>
          <div className="flex gap-4">
            <Link href={URL.admin.properties}>
              <Button variant="outline" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                {t('admin_dashboard.view_properties')}
              </Button>
            </Link>
            <Link href={URL.admin.users}>
              <Button variant="outline" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                {t('admin_dashboard.view_users')}
              </Button>
            </Link>
          </div>
        </div>

        {/* Statistiques principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 bg-white border-l-4 border-l-blue-500 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t('admin_dashboard.stats.total_properties')}</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalProperties}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {t('admin_dashboard.stats.properties_platform')}
                </p>
              </div>
              <Building2 className="h-8 w-8 text-blue-500" />
            </div>
          </Card>

          <Card className="p-6 bg-white border-l-4 border-l-green-500 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t('admin_dashboard.stats.total_users')}</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {stats.totalLandlords} {t('admin_dashboard.stats.landlords')}
                </p>
              </div>
              <Users className="h-8 w-8 text-green-500" />
            </div>
          </Card>

          <Card className="p-6 bg-white border-l-4 border-l-purple-500 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t('admin_dashboard.stats.monthly_revenue')}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.monthlyRevenue.toLocaleString('fr-FR')} FCFA
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {t('admin_dashboard.stats.platform_revenue')}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-500" />
            </div>
          </Card>

          <Card className="p-6 bg-white border-l-4 border-l-orange-500 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t('admin_dashboard.stats.occupancy_rate')}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(stats.occupiedPercentage)}%
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {stats.occupiedProperties} {t('admin_dashboard.stats.occupied_properties')}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-500" />
            </div>
          </Card>
        </div>

        {/* Graphiques et statistiques détaillées */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Graphique circulaire - Statuts */}
          <Card className="p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <PieChart className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">{t('admin_dashboard.charts.status_distribution')}</h3>
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
                      ({Math.round((item.value / stats.totalProperties) * 100)}%)
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
              <h3 className="text-lg font-semibold">{t('admin_dashboard.charts.type_distribution')}</h3>
            </div>
            <div className="space-y-4">
              {Object.entries(stats.typesStats).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between">
                  <span className="text-sm font-medium capitalize">
                    {t(`property_types.${type}`)}
                  </span>
                  <div className="text-right">
                    <span className="font-semibold">{count}</span>
                    <span className="text-sm text-gray-500 ml-2">
                      ({Math.round((count / stats.totalProperties) * 100)}%)
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
              <h3 className="text-lg font-semibold">{t('admin_dashboard.charts.location_distribution')}</h3>
            </div>
            <div className="space-y-4">
              {Object.entries(stats.locationStats).map(([location, count]) => (
                <div key={location} className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    {t(`locations.${location}`)}
                  </span>
                  <div className="text-right">
                    <span className="font-semibold">{count}</span>
                    <span className="text-sm text-gray-500 ml-2">
                      ({Math.round((count / stats.totalProperties) * 100)}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Statistiques utilisateurs */}
          <Card className="p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <Users className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">{t('admin_dashboard.charts.user_distribution')}</h3>
            </div>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{t('admin_dashboard.stats.total_users')}</span>
                <span className="font-semibold">{stats.totalUsers}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{t('admin_dashboard.stats.landlords')}</span>
                <span className="font-semibold">{stats.totalLandlords}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{t('admin_dashboard.stats.regular_users')}</span>
                <span className="font-semibold">{stats.totalRegularUsers}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{t('admin_dashboard.stats.admins')}</span>
                <span className="font-semibold">1</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Propriétés récentes */}
        <div className="mt-12 py-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {t('admin_dashboard.recent_properties')}
            </h2>
            <Link href={URL.admin.properties}>
              <Button variant="outline" size="sm">
                {t('admin_dashboard.view_all_properties')}
              </Button>
            </Link>
          </div>

          {allProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allProperties.slice(0, 6).map((property, index) => (
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
                    <div className="mt-2 text-xs text-gray-500">
                      {t('admin_dashboard.owner')}: Propriétaire {property.landlordId}
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
                  {t('admin_dashboard.no_properties_yet')}
                </h3>
                <p className="mb-4">{t('admin_dashboard.no_properties_description')}</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}