import React, { useState } from 'react';
import { View, Text, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import AppInput from '../../components/AppInput';
import AppButton from '../../components/AppButton';
import { login } from '../../service/authService';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<any>();
  const onLogin = async () => {
    if (!email || !password) {
      Alert.alert('Validation Error', 'Email dan password wajib diisi');
      return;
    }

    if (!email.includes('@')) {
      Alert.alert('Validation Error', 'Format email tidak valid');
      return;
    }
    setLoading(true);

    try {
      const result = await login({ email, password });
      await AsyncStorage.setItem('token', result.token);
      await AsyncStorage.setItem('user', JSON.stringify(result.user));

      console.log('LOGIN SUCCESS:', result);
      setTimeout(() => {
        Alert.alert('Success', 'Login berhasil');
        navigation.replace('Dashboard');
      }, 100);
    } catch (error: any) {
      console.log('LOGIN ERROR:', error);

      if (error.response) {
        const status = error.response.status;

        if (status === 401) {
          Alert.alert('Login Gagal', 'Email atau password salah');
        } else if (status === 500) {
          Alert.alert(
            'Server Error',
            'Terjadi kesalahan pada server. Silakan coba lagi nanti.',
          );
        } else {
          Alert.alert(
            'Error',
            error.response.data?.message || 'Terjadi kesalahan',
          );
        }
      } else if (error.request) {
        Alert.alert(
          'Network Error',
          'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.',
        );
      } else {
        Alert.alert('Error', 'Terjadi kesalahan yang tidak diketahui');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.pma}>Product Management App</Text>
        <Text style={styles.title}>Login</Text>
        <AppInput
          label="Email"
          placeholder="email@example.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        <AppInput
          label="Password"
          placeholder="********"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        {loading ? (
          <ActivityIndicator size="large" />
        ) : (
          <AppButton title="Login" onPress={onLogin} />
        )}
      </View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#E6EEFF',
  },
  pma: {
    fontSize: 36,
    fontWeight: '700',
    textAlign: 'center',
    color: '#466BFF',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 32,
    color: '#466BFF',
    marginTop: 16,
  },
  card: {
    backgroundColor: '#D9E4FF',
    padding: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 6,
  },
  field: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 6,
    color: '#555',
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  button: {
    marginTop: 24,
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 8,
  },
  buttonText: {
    color: '#FFF',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
  },
});
