import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute } from '@react-navigation/native';

const NavBottom = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();

  const menus = [
    { name: 'Dashboard', icon: 'home', screen: 'Dashboard' },
    { name: 'Produk', icon: 'add-box', screen: 'Product' },
    { name: 'Kategori', icon: 'category', screen: 'Category' },
    { name: 'Stok', icon: 'store', screen: 'Stock' },
  ];

  return (
    <View style={styles.container}>
      {menus.map(menu => {
        const isActive = route.name === menu.screen;

        return (
          <TouchableOpacity
            key={menu.name}
            style={styles.item}
            onPress={() => navigation.navigate(menu.screen)}
          >
            <Icon
              name={menu.icon}
              size={26}
              color={isActive ? '#FFFFFF' : '#000000'}
            />
            <Text style={[styles.label, isActive && styles.activeLabel]}>
              {menu.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default NavBottom;
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    height: 70,
    flexDirection: 'row',
    backgroundColor: '#466BFF',
    borderRadius: 16,
    justifyContent: 'space-around',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 1.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  item: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  label: {
    fontSize: 12,
    marginTop: 4,
    color: '#000000',
  },
  activeLabel: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
