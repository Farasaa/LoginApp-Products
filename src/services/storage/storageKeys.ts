 
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data',
  FAVORITES: 'favorites',
  BIOMETRIC_ENABLED: 'biometric_enabled',
  AUTO_LOCK_ENABLED: 'auto_lock_enabled',
  THEME: 'theme',
} as const;

 
export type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS];

