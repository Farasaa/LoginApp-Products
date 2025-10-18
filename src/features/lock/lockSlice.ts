import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';

interface LockState {
  isLocked: boolean;
  autoLockEnabled: boolean;
  autoLockTimeout: number; 
  biometricEnabled: boolean;
  lastActivityTime: number;
}

const initialState: LockState = {
  isLocked: false,
  autoLockEnabled: true,
  autoLockTimeout: 10, 
  biometricEnabled: false, 
  lastActivityTime: Date.now(),
};

const lockSlice = createSlice({
  name: 'lock',
  initialState,
  reducers: {
    lockApp: (state) => {
      state.isLocked = true;
    },
    unlockApp: (state) => {
      state.isLocked = false;
      state.lastActivityTime = Date.now();
    },
    updateLastActivity: (state) => {
      state.lastActivityTime = Date.now();
    },
    setAutoLockEnabled: (state, action: PayloadAction<boolean>) => {
      state.autoLockEnabled = action.payload;
    },
    setAutoLockTimeout: (state, action: PayloadAction<number>) => {
      state.autoLockTimeout = action.payload;
    },
    setBiometricEnabled: (state, action: PayloadAction<boolean>) => {
      state.biometricEnabled = action.payload;
    },
  },
});

export const {
  lockApp,
  unlockApp,
  updateLastActivity,
  setAutoLockEnabled,
  setAutoLockTimeout,
  setBiometricEnabled,
} = lockSlice.actions;
 
export const selectIsLocked = (state: RootState) => state.lock.isLocked;
export const selectAutoLockEnabled = (state: RootState) => state.lock.autoLockEnabled;
export const selectAutoLockTimeout = (state: RootState) => state.lock.autoLockTimeout;
export const selectBiometricEnabled = (state: RootState) => state.lock.biometricEnabled;
export const selectLastActivityTime = (state: RootState) => state.lock.lastActivityTime;

export default lockSlice.reducer;


