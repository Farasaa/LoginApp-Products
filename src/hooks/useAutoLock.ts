import { useEffect, useRef, useCallback } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
  lockApp,
  updateLastActivity,
  selectAutoLockEnabled,
  selectAutoLockTimeout,
  selectIsLocked,
} from '../features/lock/lockSlice';
import { selectIsAuthenticated } from '../features/auth/authSlice';

 
export const useAutoLock = () => {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isLocked = useAppSelector(selectIsLocked);
  const autoLockEnabled = useAppSelector(selectAutoLockEnabled);
  const autoLockTimeout = useAppSelector(selectAutoLockTimeout);
  
  const inactivityTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const appStateRef = useRef(AppState.currentState);

 
  const resetInactivityTimer = useCallback(() => {
     
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
      inactivityTimerRef.current = null;
    }

    if (isAuthenticated && !isLocked && autoLockEnabled) {
      dispatch(updateLastActivity());

      inactivityTimerRef.current = setTimeout(() => {
        dispatch(lockApp());
      }, autoLockTimeout * 1000);
    }
  }, [isAuthenticated, isLocked, autoLockEnabled, autoLockTimeout, dispatch]);

  
  useEffect(() => {
    if (!isAuthenticated || !autoLockEnabled || isLocked) {
      
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
        inactivityTimerRef.current = null;
      }
      return;
    }

    
    resetInactivityTimer();

    
    return () => {
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
        inactivityTimerRef.current = null;
      }
    };
  }, [isAuthenticated, autoLockEnabled, isLocked, resetInactivityTimer]);

  
  useEffect(() => {
    if (!isAuthenticated || !autoLockEnabled) return;

    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      
      if (
        appStateRef.current.match(/active/) &&
        nextAppState.match(/inactive|background/)
      ) {
        
        if (inactivityTimerRef.current) {
          clearTimeout(inactivityTimerRef.current);
          inactivityTimerRef.current = null;
        }
        dispatch(lockApp());
      }

      
      if (
        appStateRef.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        
        if (!isLocked) {
          resetInactivityTimer();
        }
      }

      appStateRef.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [isAuthenticated, autoLockEnabled, isLocked, dispatch, resetInactivityTimer]);

  return {
    resetInactivityTimer, 
  };
};
