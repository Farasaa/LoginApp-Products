import { storage } from '../storage/mmkv';
import { PersistedClient, Persister } from '@tanstack/react-query-persist-client';

/**
 * MMKV Persister for React Query Cache
 * This persists the React Query cache to MMKV storage
 * so data is available instantly on app relaunch (even offline)
 */

const QUERY_CACHE_KEY = 'react_query_cache';

export const createMMKVPersister = (): Persister => {
  return {
    persistClient: async (client: PersistedClient) => {
      try {
        storage.set(QUERY_CACHE_KEY, JSON.stringify(client));
      } catch (error) {
        console.error('Error persisting React Query cache to MMKV:', error);
      }
    },
    restoreClient: async () => {
      try {
        const cachedData = storage.getString(QUERY_CACHE_KEY);
        if (cachedData) {
          return JSON.parse(cachedData) as PersistedClient;
        }
        return undefined;
      } catch (error) {
        console.error('Error restoring React Query cache from MMKV:', error);
        return undefined;
      }
    },
    removeClient: async () => {
      try {
        storage.delete(QUERY_CACHE_KEY);
      } catch (error) {
        console.error('Error removing React Query cache from MMKV:', error);
      }
    },
  };
};

