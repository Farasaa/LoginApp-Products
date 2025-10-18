import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { BlurView } from '@react-native-community/blur';
import Toast from 'react-native-toast-message';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { unlockApp, selectIsLocked, selectBiometricEnabled } from '../../features/lock/lockSlice';
import { logout } from '../../features/auth/authSlice';
import { selectUser } from '../../features/auth/authSlice';
import { biometricService } from '../../services/biometric/biometricService';
import { storageUtils } from '../../services/storage/mmkv';

 
const LockOverlay: React.FC = () => {
  const dispatch = useAppDispatch();
  const isLocked = useAppSelector(selectIsLocked);
  const biometricEnabled = useAppSelector(selectBiometricEnabled);
  const user = useAppSelector(selectUser);

  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [password, setPassword] = useState('');
  const [biometryType, setBiometryType] = useState<string>('Biometric');
 
  useEffect(() => {
    const checkBiometric = async () => {
       
      const { available, biometryType: type } = await biometricService.isBiometricAvailable();
      
      
      if (available && type) {
        const typeName = biometricService.getBiometryTypeName(type);
       
        setBiometryType(typeName);
      }
    };  

    checkBiometric();
  }, [biometricEnabled]);

  const handleBiometricUnlock = async () => {
    setIsAuthenticating(true);

    const { success } = await biometricService.authenticate('Unlock App');

    setIsAuthenticating(false);

    if (success) {
      dispatch(unlockApp());
      Toast.show({
        type: 'success',
        text2: 'Welcome back',
      });
    } else {
     
      setShowPasswordInput(true);
      Toast.show({
        type: 'info',
        text1: 'Authentication Failed',
        text2: 'Please enter your password',
      });
    }
  };

  const handlePasswordUnlock = () => {
    
    if (password.trim().length > 0) {
      dispatch(unlockApp());
      setPassword('');
      setShowPasswordInput(false);
      Toast.show({
        type: 'success',
        text2: 'Welcome back',
      });
    } else {
      Toast.show({
        type: 'error',
        text1: 'Invalid Password',
        text2: 'Please try again',
      });
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    storageUtils.clearAuth();
    dispatch(unlockApp());  
    Toast.show({
      type: 'info',
      text1: 'Logged Out',
      text2: 'See you next time!',
    });
  };

  if (!isLocked) {
    return null;
  }

  return (
    <Modal
      visible={isLocked}
      animationType="fade"
      transparent={true}
      statusBarTranslucent={true}
    >
      <BlurView
        style={styles.blurContainer}
        blurType="dark"
        blurAmount={20}
        reducedTransparencyFallbackColor="rgba(0, 0, 0, 0.9)"
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
        >
          <View style={styles.content}>
            
            <View style={styles.lockIcon}>
              <Text style={styles.lockEmoji}>🔒</Text>
            </View>

          
            <Text style={styles.title}>App Locked</Text>
            <Text style={styles.subtitle}>
              {user?.name ? `Welcome back, ${user.name.split(' ')[0]}` : 'Unlock to continue'}
            </Text>

           
            {!showPasswordInput && (
              <View style={styles.actionsContainer}>
                {biometricEnabled ? (
                  <>
                    <TouchableOpacity
                      style={styles.biometricButton}
                      onPress={handleBiometricUnlock}
                      disabled={isAuthenticating}
                    >
                      {isAuthenticating ? (
                        <ActivityIndicator color="#fff" />
                      ) : (
                        <>
                          <Text style={styles.biometricIcon}>
                            {biometryType === 'Face ID' ? '👤' : '👆'}
                          </Text>
                          <Text style={styles.biometricButtonText}>
                            Unlock with {biometryType}
                          </Text>
                        </>
                      )}
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.passwordLink}
                      onPress={() => setShowPasswordInput(true)}
                    >
                      <Text style={styles.passwordLinkText}>Use Password Instead</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  
                  <TouchableOpacity
                    style={styles.biometricButton}
                    onPress={() => setShowPasswordInput(true)}
                  >
                    <Text style={styles.biometricIcon}>🔑</Text>
                    <Text style={styles.biometricButtonText}>
                      Unlock with Password
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            )}

        
            {showPasswordInput && (
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Enter your password"
                  placeholderTextColor="#999"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                  autoFocus
                  onSubmitEditing={handlePasswordUnlock}
                />

                <TouchableOpacity
                  style={styles.unlockButton}
                  onPress={handlePasswordUnlock}
                >
                  <Text style={styles.unlockButtonText}>Unlock</Text>
                </TouchableOpacity>

                {biometricEnabled && (
                  <TouchableOpacity
                    style={styles.backLink}
                    onPress={() => {
                      setShowPasswordInput(false);
                      setPassword('');
                    }}
                  >
                    <Text style={styles.backLinkText}>← Back to {biometryType}</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}

         
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Text style={styles.logoutButtonText}>Sign Out</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </BlurView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  blurContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  content: {
    width: '85%',
    alignItems: 'center',
    padding: 30,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  lockIcon: {
    marginBottom: 24,
  },
  lockEmoji: {
    fontSize: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#ccc',
    marginBottom: 32,
    textAlign: 'center',
  },
  actionsContainer: {
    width: '100%',
    alignItems: 'center',
  },
  biometricButton: {
    width: '100%',
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  biometricIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  biometricButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  passwordLink: {
    paddingVertical: 12,
  },
  passwordLinkText: {
    color: '#007AFF',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  passwordContainer: {
    width: '100%',
  },
  passwordInput: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#fff',
    marginBottom: 16,
  },
  unlockButton: {
    width: '100%',
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  unlockButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  backLink: {
    paddingVertical: 12,
    alignSelf: 'center',
  },
  backLinkText: {
    color: '#007AFF',
    fontSize: 14,
  },
  logoutButton: {
    marginTop: 24,
    paddingVertical: 12,
  },
  logoutButtonText: {
    color: '#ff3b30',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default LockOverlay;


