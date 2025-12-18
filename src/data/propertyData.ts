// data/propertyData.ts
import { FilterData } from '@/types/home';
import { Property } from '@/types/property';

export const allProperties: Property[] = [
  {
    id: 1,
    title: 'property_titles.modern_apartment',
    type: 'apartment',
    price: 350000,
    location: 'locations.douala',
    status: 'available',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=600&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&h=400&fit=crop'
    ],
    beds: 3,
    baths: 2,
    area: 110,
    featured: true, // En vedette
    description: 'property_descriptions.modern_apartment',
    address: 'Bonapriso, Douala',
    latitude: 4.0511,
    longitude: 9.7679,
    landlordId: '2'
  },
  {
    id: 2,
    title: 'property_titles.cozy_studio',
    type: 'studio',
    price: 100000,
    location: 'locations.yaounde',
    status: 'occupied',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=600&h=400&fit=crop'
    ],
    beds: 1,
    baths: 1,
    area: 25,
    featured: true, // En vedette
    description: 'property_descriptions.cozy_studio',
    address: 'Bastos, Yaoundé',
    latitude: 3.8480,
    longitude: 11.5021,
    landlordId: '2'
  },
  {
    id: 3,
    title: 'property_titles.house_garden',
    type: 'house',
    price: 600000,
    location: 'locations.bafoussam',
    status: 'pending',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=600&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&h=400&fit=crop'
    ],
    beds: 4,
    baths: 3,
    area: 200,
    featured: false,
    description: 'property_descriptions.house_garden',
    address: 'Quartier Commercial, Bafoussam',
    latitude: 5.4766,
    longitude: 10.4242,
    landlordId: '4'
  },
  {
    id: 4,
    title: 'property_titles.luxury_loft',
    type: 'loft',
    price: 450000,
    location: 'locations.garoua',
    status: 'available',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1505842381624-c6b057962c4e?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=600&h=400&fit=crop'
    ],
    beds: 3,
    baths: 2,
    area: 150,
    featured: false,
    description: 'property_descriptions.luxury_loft',
    address: 'Centre-ville, Garoua',
    latitude: 9.3014,
    longitude: 13.3727,
    landlordId: '4'
  },
  {
    id: 5,
    title: 'property_titles.downtown_flat',
    type: 'apartment',
    price: 280000,
    location: 'locations.douala',
    status: 'available',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop'
    ],
    beds: 2,
    baths: 1,
    area: 75,
    featured: false,
    description: 'property_descriptions downtown_flat',
    address: 'Akwa, Douala',
    latitude: 4.0522,
    longitude: 9.7000,
    landlordId: '2'
  },
  {
    id: 6,
    title: 'property_titles.quiet_studio',
    type: 'studio',
    price: 120000,
    location: 'locations.yaounde',
    status: 'occupied',
    rating: 4.4,
    image: 'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=600&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=600&h=400&fit=crop'
    ],
    beds: 1,
    baths: 1,
    area: 30,
    featured: false,
    description: 'property_descriptions.quiet_studio',
    address: 'Melen, Yaoundé',
    latitude: 3.8667,
    longitude: 11.5167,
    landlordId: '2'
  },
  {
    id: 7,
    title: 'property_titles.spacious_house',
    type: 'house',
    price: 750000,
    location: 'locations.bafoussam',
    status: 'available',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&h=400&fit=crop'
    ],
    beds: 5,
    baths: 3,
    area: 250,
    featured: true, // En vedette
    description: 'property_descriptions.spacious_house',
    address: 'Quartier Résidentiel, Bafoussam',
    latitude: 5.4866,
    longitude: 10.4342,
    landlordId: '4'
  },
  {
    id: 8,
    title: 'property_titles.modern_room',
    type: 'room',
    price: 80000,
    location: 'locations.douala',
    status: 'pending',
    rating: 4.3,
    image: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=600&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=600&h=400&fit=crop'
    ],
    beds: 1,
    baths: 1,
    area: 20,
    featured: false,
    description: 'property_descriptions.modern_room',
    address: 'Deido, Douala',
    latitude: 4.0611,
    longitude: 9.7779,
    landlordId: '2'
  },
  {
    id: 9,
    title: 'property_titles.luxury_apartment',
    type: 'apartment',
    price: 550000,
    location: 'locations.yaounde',
    status: 'available',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=600&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=600&h=400&fit=crop'
    ],
    beds: 3,
    baths: 2,
    area: 120,
    featured: false,
    description: 'property_descriptions.luxury_apartment',
    address: 'Odza, Yaoundé',
    latitude: 3.8580,
    longitude: 11.5121,
    landlordId: '4'
  }
];

export const featuredProperties: Property[] = allProperties.filter(property => property.featured);


export const filterOptions: FilterData = {
  status: [
    { value: '', label: 'filters.labels.all_status' },
    { value: 'available', label: 'property_status.available' },
    { value: 'occupied', label: 'property_status.occupied' },
    { value: 'pending', label: 'property_status.pending' }
  ],
  locations: [
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