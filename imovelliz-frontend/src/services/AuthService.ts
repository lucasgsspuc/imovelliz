import { imovellizApi } from './ImovellizApi';

export const AUTH_PATH = '/auth';

export class AuthService {
  static async login(data: any) {
    return imovellizApi
      .post<any>(`${AUTH_PATH}/sign-in`, data)
      .then((response) => response.data);
  }

  static async register(data: any) {
    return imovellizApi
      .post<any>(`${AUTH_PATH}/sign-up`, data)
      .then((response) => response.data);
  }

  static async getProfile() {
    return imovellizApi
      .get<any>(`${AUTH_PATH}/profile`)
      .then((response) => response.data);
  }

  static async logout() {
    return imovellizApi
      .post<any>(`${AUTH_PATH}/logout`, {})
      .then((response) => response.data);
  }
}
