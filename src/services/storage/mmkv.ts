import { MMKV } from 'react-native-mmkv';

 
export const storage = new MMKV({
  id: 'login-app-storage',
});
 
export const storageUtils = {
  
  saveToken: (token: string): void => {
    storage.set('auth_token', token);
  },
  
  getToken: (): string | undefined => {
    return storage.getString('auth_token');
  },
  
  removeToken: (): void => {
    storage.delete('auth_token');
  },

  saveRefreshToken: (token: string): void => {
    storage.set('refresh_token', token);
  },
  
  getRefreshToken: (): string | undefined => {
    return storage.getString('refresh_token');
  },
  
  removeRefreshToken: (): void => {
    storage.delete('refresh_token');
  },

  saveUser: (user: any): void => {
    storage.set('user_data', JSON.stringify(user));
  },
  
  getUser: (): any | null => {
    const userData = storage.getString('user_data');
    return userData ? JSON.parse(userData) : null;
  },
  
  removeUser: (): void => {
    storage.delete('user_data');
  },

  saveFavorites: (favorites: string[]): void => {
    storage.set('favorites', JSON.stringify(favorites));
  },
  
  getFavorites: (): string[] => {
    const favs = storage.getString('favorites');
    return favs ? JSON.parse(favs) : [];
  },

  clearAuth: (): void => {
    storage.delete('auth_token');
    storage.delete('refresh_token');
    storage.delete('user_data');
  },

  clearAll: (): void => {
    storage.clearAll();
  },
};

export default storage;

