import React from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { authEndpoints, type LoginResponse, type ValidateSessionResponse } from '../endpoints/authEndpoints';
import { useAppDispatch } from '../../app/hooks';
import { setUser, setToken, logout as logoutAction } from '../../features/auth/authSlice';
import { storageUtils } from '../../services/storage/mmkv';

interface LoginRequest {
  username: string;
  password: string;
}

export const useLogin = () => {
  const dispatch = useAppDispatch();

  return useMutation<LoginResponse, any, LoginRequest>({
    mutationFn: (credentials: LoginRequest) => authEndpoints.login(credentials),
        
    onSuccess: async (data) => {
      try {
        
        const userProfile = await authEndpoints.getUserById(data.id);
        

        const userRole = userProfile.role || 'user';

        dispatch(setUser({
          id: data.id.toString(),
          email: data.email,
          name: `${data.firstName} ${data.lastName}`,
          role: userRole,
          avatar: data.image,
        }));
        dispatch(setToken(data.accessToken));

        storageUtils.saveToken(data.accessToken);
        storageUtils.saveRefreshToken(data.refreshToken);
        storageUtils.saveUser({
          id: data.id.toString(),
          email: data.email,
          name: `${data.firstName} ${data.lastName}`,
          role: userRole,
          avatar: data.image,
        });

        const roleEmoji = userRole === 'admin' ? '👑' : userRole === 'moderator' ? '⭐' : '🎉';
        const roleText = userRole === 'admin' ? 'Admin' : userRole === 'moderator' ? 'Moderator' : '';
        
        Toast.show({
          type: 'success',
          text1: `Login Successful! ${roleEmoji}`,
          text2: roleText 
            ? `Welcome back, ${roleText} ${data.firstName}!` 
            : `Welcome back, ${data.firstName}!`,
        });
      } catch (error: any) {
        console.error(' Failed to fetch user profile:', error);
        dispatch(setUser({
          id: data.id.toString(),
          email: data.email,
          name: `${data.firstName} ${data.lastName}`,
          role: 'user',
          avatar: data.image,
        }));
        dispatch(setToken(data.accessToken));
        
        storageUtils.saveToken(data.accessToken);
        storageUtils.saveRefreshToken(data.refreshToken);
        storageUtils.saveUser({
          id: data.id.toString(),
          email: data.email,
          name: `${data.firstName} ${data.lastName}`,
          role: 'user',
          avatar: data.image,
        });

        Toast.show({
          type: 'success',
          text1: 'Login Successful!',
          text2: `Welcome back, ${data.firstName}!`,
        });
      }
    },
    
    onError: (error: any) => {
      Toast.show({
        type: 'error',
        text1: 'Login Failed',
        text2: error.response?.data?.message || 'Please check your credentials',
      });
    },
  });
};

export const useLogout = () => {
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: async () => {
    },
    onSuccess: () => {
      dispatch(logoutAction());
  
      storageUtils.clearAuth();
  
      Toast.show({
        type: 'info',
        text1: 'Logged Out',
        text2: 'See you next time!',
      });
    },
  });
};

export const useValidateSession = (enabled: boolean = false) => {
  const dispatch = useAppDispatch();

  const query = useQuery<ValidateSessionResponse, any>({
    queryKey: ['auth', 'validateSession'],
    queryFn: () => authEndpoints.validateSession(),
    enabled,
    retry: false,
    staleTime: Infinity,
  });

  React.useEffect(() => {
    if (query.isSuccess && query.data) {
      
      const fetchUserRole = async () => {
        try {
           
          const userProfile = await authEndpoints.getUserById(query.data.id);
 

          dispatch(setUser({
            id: query.data.id.toString(),
            email: query.data.email,
            name: `${query.data.firstName} ${query.data.lastName}`,
            role: userProfile.role || 'user',  
            avatar: query.data.image,
          }));
        } catch (error) {
          console.error('Failed to fetch user profile during session validation:', error);
       
          dispatch(setUser({
            id: query.data.id.toString(),
            email: query.data.email,
            name: `${query.data.firstName} ${query.data.lastName}`,
            role: 'user',
            avatar: query.data.image,
          }));
        }
      };

      fetchUserRole();
    }

    if (query.isError) {
      dispatch(logoutAction());
      storageUtils.clearAuth();
      Toast.show({
        type: 'error',
        text2: 'Please login again',
      });
    }
  }, [query.isSuccess, query.isError, query.data, dispatch]);

  return query;
};
