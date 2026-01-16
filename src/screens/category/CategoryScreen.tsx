import React, { useState,  useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import api from '../../service/api';
import FabButton from '../../components/FabButton';
import Navbar from '../../components/Navbar';
import NavBottom from '../../components/NavBottom';
import { useNavigation } from '@react-navigation/native';

interface Category {
  id_kategori: number;
  nama_kategori: string;
}

const CategoryScreen = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<any>();

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await api.get('/kategori');
      setCategories(res.data);
    } catch (err) {
      console.log('Fetch category error:', err);
      Alert.alert('Error', 'Gagal mengambil data kategori');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
  useCallback(() => {
    fetchCategories();
  }, [])
);

  const handleDelete = (id: number) => {
    Alert.alert('Hapus Kategori', 'Yakin ingin menghapus kategori ini?', [
      { text: 'Batal' },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.delete(`/kategori/${id}`);
            fetchCategories();
          } catch (err) {
            console.log('Delete category error:', err);
            Alert.alert('Error', 'Gagal menghapus kategori');
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }: { item: Category }) => (
    <View style={styles.card}>
      <Text style={styles.name}>{item.nama_kategori}</Text>

      <View style={styles.action}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('CategoryForm', { category: item })
          }
        >
          <Icon name="edit" size={22} color="#2563eb" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handleDelete(item.id_kategori)}>
          <Icon name="delete" size={22} color="red" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Navbar title="Kategori" />

      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={categories}
          keyExtractor={item => item.id_kategori.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 120 }}
        />
      )}
 <FabButton
        icon="add"
        onPress={() => navigation.navigate('CategoryForm')}
      />
      <NavBottom />
    </View>
  );
};

export default CategoryScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 100,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#466BFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    justifyContent: 'center',
  },
  addText: {
    color: '#fff',
    marginLeft: 6,
    fontWeight: '600',
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  action: {
    flexDirection: 'row',
    gap: 12,
  },
});
