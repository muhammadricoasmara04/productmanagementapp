import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { logout } from '../service/authService';

interface NavbarProps {
  title: string;
}
const Navbar: React.FC<NavbarProps> = ({ title }) => {
  const navigation = useNavigation<any>();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    setOpen(false);
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
  return (
    <>
      {open && (
        <Pressable style={styles.overlay} onPress={() => setOpen(false)} />
      )}

      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>

        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => setOpen(!open)}
        >
          <Icon name="account-circle" size={32} color="#111" />
        </TouchableOpacity>

        {open && (
          <View style={styles.menu}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setOpen(false);
                navigation.navigate('Profile');
              }}
            >
              <Icon name="person" size={20} color="#111" />
              <Text style={styles.menuText}>Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
              <Icon name="logout" size={20} color="red" />
              <Text style={styles.menuLogout}>Logout</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </>
  );
};

export default Navbar;
const styles = StyleSheet.create({
  container: {
    height: 80,
    backgroundColor: '#466BFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#003366',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100, 
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color:'#FFFFFF'
  },
  profileButton: {
    position: 'absolute',
    right: 16,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 90,
  },

  menu: {
    position: 'absolute',
    top: 70,
    right: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 6,
    width: 150,
    elevation: 5,
    zIndex: 200,
  },

  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 10,
  },

  menuText: {
    fontSize: 14,
    fontWeight: '500',
  },
  menuLogout: {
    fontSize: 14,
    fontWeight: '500',
    color: 'red',
  },
});
