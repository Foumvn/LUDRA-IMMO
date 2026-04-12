import api from './api';

export interface Property {
  id: string;
  title: string;
  description: string;
  type: 'house' | 'apartment' | 'villa' | 'studio' | 'office' | 'land';
  price: number;
  rooms: number;
  bathrooms: number;
  surface: number;
  city: string;
  status: 'available' | 'sold' | 'rented' | 'unavailable';
  images: string[];
  createdAt: string;
}

export interface CreatePropertyRequest {
  title: string;
  description: string;
  type: 'house' | 'apartment' | 'villa' | 'studio' | 'office' | 'land';
  price: number;
  rooms: number;
  bathrooms: number;
  surface: number;
  city: string;
  images: string[];
}

export const propertyService = {
  async getAllProperties(): Promise<Property[]> {
    const response = await api.get('/api/properties');
    return response.data.data;
  },

  async getPropertyById(id: string): Promise<Property> {
    const response = await api.get(`/api/properties/${id}`);
    return response.data.data;
  },

  async createProperty(propertyData: CreatePropertyRequest): Promise<Property> {
    const response = await api.post('/api/properties', propertyData);
    return response.data.data;
  },

  async updateProperty(id: string, propertyData: Partial<CreatePropertyRequest>): Promise<Property> {
    const response = await api.put(`/api/properties/${id}`, propertyData);
    return response.data.data;
  },

  async deleteProperty(id: string): Promise<void> {
    await api.delete(`/api/properties/${id}`);
  },

  async searchProperties(filters: {
    city?: string;
    type?: string;
    minPrice?: number;
    maxPrice?: number;
    minRooms?: number;
    maxRooms?: number;
  }): Promise<Property[]> {
    const response = await api.get('/api/properties/search', { params: filters });
    return response.data.data;
  }
};
