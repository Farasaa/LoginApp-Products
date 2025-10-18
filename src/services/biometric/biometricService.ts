import ReactNativeBiometrics, { BiometryTypes, BiometryType } from 'react-native-biometrics';

const rnBiometrics = new ReactNativeBiometrics();

 

export const biometricService = {
 
  isBiometricAvailable: async (): Promise<{
    available: boolean;
    biometryType: BiometryType | null;
  }> => {
    try {
 
      const { available, biometryType } = await rnBiometrics.isSensorAvailable();
    
      return { available, biometryType: biometryType ?? null };
    } catch (error) {
      console.error('biometricService - Error checking biometric availability:', error);
      return { available: false, biometryType: null };
    }
  },

 
  authenticate: async (promptMessage: string = 'Authenticate to unlock'): Promise<{
    success: boolean;
    error?: string;
  }> => {
    try {
      const { success } = await rnBiometrics.simplePrompt({
        promptMessage,
        cancelButtonText: 'Use Password',
      });

      return { success };
    } catch (error: any) {
      console.error('authentication error:', error);
      return {
        success: false,
        error: error.message || 'Authentication failed',
      };
    }
  },

 
  getBiometryTypeName: (biometryType: BiometryType | null): string => {
    switch (biometryType) {
      case BiometryTypes.FaceID:
        return 'Face ID';
      case BiometryTypes.TouchID:
        return 'Touch ID';
      case BiometryTypes.Biometrics:
        return 'Biometric';
      default:
        return 'Biometric';
    }
  },
};


