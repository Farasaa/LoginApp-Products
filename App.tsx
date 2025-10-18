import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { Provider, useDispatch } from 'react-redux';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import Toast from 'react-native-toast-message';
import { store } from './src/app/store';
import { queryClient } from './src/api/client/queryClient';
import { createMMKVPersister } from './src/services/cache/queryPersister';
import { storageUtils } from './src/services/storage/mmkv';
import { setUser, setToken } from './src/features/auth/authSlice';
import { useValidateSession } from './src/api/hooks/useAuth';
import { setBiometricEnabled } from './src/features/lock/lockSlice';
import { biometricService } from './src/services/biometric/biometricService';
import AppNavigator from './src/navigation/AppNavigator';
import LockOverlay from './src/components/lock/LockOverlay';
import ActivityDetector from './src/components/common/ActivityDetector';

 
const persister = createMMKVPersister();

function AppContent() {
  const dispatch = useDispatch();
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [shouldValidate, setShouldValidate] = useState(false);

  const { isLoading: isValidating } = useValidateSession(Boolean(shouldValidate));

  useEffect(() => {
    const initializeSession = async () => {
      
      const { available } = await biometricService.isBiometricAvailable();
      dispatch(setBiometricEnabled(available));
      
      const token = storageUtils.getToken();
      const user = storageUtils.getUser();

      if (token && user) {
        dispatch(setToken(token));
        dispatch(setUser(user));
        
        setShouldValidate(true);
        
        Toast.show({
          type: 'info',
          text1: 'Validating Session...',
          text2: 'Please wait',
          visibilityTime: 2000,
        });
      } else {
        setIsCheckingSession(false);
      }
    };

    initializeSession();
  }, [dispatch]);

  useEffect(() => {
    if (shouldValidate && !isValidating) {
      setIsCheckingSession(false);
      Toast.show({
        type: 'success',
        text1: 'Welcome Back!',
        text2: 'Session validated successfully',
      });
    }
  }, [shouldValidate, isValidating]);

  if (isCheckingSession) {
    return (
      <View style={styles.splashContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.splashText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ActivityDetector>
      <AppNavigator />
      <LockOverlay />
    </ActivityDetector>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  splashText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
});

function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <PersistQueryClientProvider
          client={queryClient}
          persistOptions={{
            persister,
            maxAge: 24 * 60 * 60 * 1000, 
            buster: new Date().toISOString(), 
          }}
        >
          <NavigationContainer>
            <AppContent />
          </NavigationContainer>
          <Toast />
        </PersistQueryClientProvider>
      </SafeAreaProvider>
    </Provider>
  );
}

export default App;

