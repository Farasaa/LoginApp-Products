import axios from 'axios';
import Toast from 'react-native-toast-message';
import { storage, storageUtils } from '../../services/storage/mmkv';

const apiClient = axios.create({
  baseURL: 'https://dummyjson.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

 
apiClient.interceptors.request.use(
  async (config) => {
    const token = storage.getString('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

 
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
       
      storageUtils.clearAuth();
      Toast.show({
        type: 'error',
        text2: 'Please login again',
      });
     
    }
    
    if (error.response?.status === 500) {
      Toast.show({
        type: 'error',
        text1: 'Server Error',
        text2: 'Something went wrong. Please try again later.',
      });
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;