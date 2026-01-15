import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface NavbarProps {
  title: string;
}
const Navbar: React.FC<NavbarProps> = ({ title }) => {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      <TouchableOpacity
        style={styles.profileButton}
        onPress={() => navigation.navigate('Profile')}
      >
        <Icon name="account-circle" size={32} color="#111" />
      </TouchableOpacity>
    </View>
  );
};

export default Navbar;
const styles = StyleSheet.create({
  container: {
    height: 80,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#003366',
    position: 'absolute', // <- ini bikin fix di atas
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100, // <- supaya di atas konten
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  profileButton: {
    position: 'absolute',
    right: 16,
  },
});
