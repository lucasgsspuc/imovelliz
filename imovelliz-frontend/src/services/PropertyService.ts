import { imovellizApi } from './ImovellizApi';

export const PROPERTY_AUTH = '/properties';

export interface CreatePropertyDto {
  title: string;
  description: string;
  address: string;
  city: string;
  state: string;
  type: string;
  price: number;
  salePrice: number;
  area: number;
  bedrooms: number;
  bathrooms: number;
  parkingSpaces: number;
  furnished: boolean;
  latitude: number;
  longitude: number;
}
export interface UpdatePropertyDto {
  title?: string;
  description?: string;
  price?: number;
  type?: string;
  address?: string;
  city?: string;
  salePrice?: number;
  state?: string;
  area?: number;
  bedrooms?: number;
  bathrooms?: number;
  furnished?: boolean;
  parkingSpaces?: number;
}
export class PropertyService {
  static async home() {
    return imovellizApi
      .get<any>(`${PROPERTY_AUTH}/home`)
      .then((response) => response.data);
  }

  static async getOne(id: string) {
    return imovellizApi
      .get<any>(`${PROPERTY_AUTH}/${id}`)
      .then((response) => response.data);
  }

  static async getAll() {
    return imovellizApi
      .get<any>(`${PROPERTY_AUTH}`)
      .then((response) => response.data);
  }

  static async getAllByUser() {
    return imovellizApi
      .get<any>(`${PROPERTY_AUTH}/user`)
      .then((response) => response.data);
  }

  static async create(data: FormData) {
    return imovellizApi
      .post<any>(`${PROPERTY_AUTH}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((response) => response.data);
  }

  static async update(id: string, data: any) {
    return imovellizApi
      .put<any>(`${PROPERTY_AUTH}/${id}`, data)
      .then((response) => response.data);
  }

  static async saveFavorite(propertyId: string) {
    return imovellizApi
      .post<any>(`${PROPERTY_AUTH}/favorites`, { propertyId })
      .then((response) => response.data);
  }

  static async getFavorites() {
    return imovellizApi
      .get<any>(`${PROPERTY_AUTH}/favorites`)
      .then((response) => response.data);
  }

  static async deleteFavorite(id: string) {
    return imovellizApi
      .delete(`${PROPERTY_AUTH}/favorites/${id}`)
      .then((response) => response.data);
  }

  static async delete(id: string) {
    return imovellizApi
      .delete(`${PROPERTY_AUTH}/${id}`)
      .then((response) => response.data);
  }
}
