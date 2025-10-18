import React from 'react';
import { useAppSelector } from '../app/hooks';
import { selectIsAuthenticated } from '../features/auth/authSlice';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';

const AppNavigator = () => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

   
  return isAuthenticated ? <MainNavigator /> : <AuthNavigator />;
};

export default AppNavigator;

