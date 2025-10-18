import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Input from '../../components/common/Input';
import CustomButton from '../../components/common/Button';
import { useLogin } from '../../api/hooks/useAuth';

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const { mutate: login, isPending } = useLogin();

  const handleLogin = () => {
    if (!username || !password) {
      return;
    }
    
    login({
      username,
      password,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Login into your account</Text>
        
        <Input 
          placeholder="Username"
          keyboardType="default"
          style={styles.inputSpacing}
          required={true}
          value={username}
          onChangeText={setUsername}
        />
        
        <Input 
          placeholder="Password"
          keyboardType="default"
          style={styles.inputSpacing}
          required={true}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        
        <CustomButton 
          title={isPending ? "Logging in..." : "Login"}
          style={styles.button}
          onPress={handleLogin}
          disabled={isPending || !username || !password}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 40,
    textAlign: 'center',
    color: 'blue',
  },
  inputSpacing: {
    marginTop: 16,
    borderRadius: 10,
  },
  button: {
    marginTop: 24,
    backgroundColor: 'blue',
    borderRadius: 20,
  },
});

export default LoginScreen;
