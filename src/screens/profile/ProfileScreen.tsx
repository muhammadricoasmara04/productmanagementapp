import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { logout } from '../../service/authService';
import AppButton from '../../components/AppButton';
import Navbar from '../../components/Navbar';

interface User {
  id_user: number;
  nama_user: string;
  email: string;
}

const ProfileScreen = () => {
  const navigation = useNavigation<any>();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    };

    loadUser();
  }, []);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Yakin ingin logout?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          },
        },
      ],
      { cancelable: true },
    );
  };

  if (!user) return null;

  return (
    <View style={styles.container}>
      <Navbar title="Profile" />
      <Image
        source={{ uri: 'https://i.pravatar.cc/300' }}
        style={styles.avatar}
      />

      <Text style={styles.name}>{user.nama_user}</Text>
      <Text style={styles.email}>{user.email}</Text>

      <View style={styles.buttonWrapper}>
        <AppButton title="Logout" variant="danger" onPress={handleLogout} />
        <AppButton title="Kembali" onPress={() => navigation.goBack()} />
      </View>
    </View>
  );
};

export default ProfileScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 120,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
  },
  email: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  buttonWrapper: {
    width: '100%',
    paddingHorizontal: 24,
    marginTop: 24,
  },
  logoutBtn: {
    backgroundColor: '#EF4444',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  logoutText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
