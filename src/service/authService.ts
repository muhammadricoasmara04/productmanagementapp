import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';
interface LoginPayload {
  email: string;
  password: string;
}

export const login = async (payload: LoginPayload) => {
  const response = await api.post('/auth/login', payload);
  return response.data;
};

export const logout = async () => {
  try {
    // OPTIONAL → kalau backend ada endpoint logout
    await api.post('/auth/logout');
  } catch (error) {
    console.log(error);
    // kalau backend ga wajib logout, abaikan error
  } finally {
    // HAPUS DATA AUTH
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');

    // HAPUS HEADER AUTH
    delete api.defaults.headers.common['Authorization'];
  }
};
