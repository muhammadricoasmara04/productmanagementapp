import React, { useState , useCallback} from 'react';
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
import Navbar from '../../components/Navbar';
import NavBottom from '../../components/NavBottom';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';

interface Product {
  id_produk: number;
  nama_produk: string;
  nama_kategori: string;
  kode_produk: string;
}

const ProductScreen = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<any>();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/produk');
      setProducts(res.data);
    } catch (err) {
      console.log('Fetch products error:', err);
      Alert.alert('Error', 'Gagal mengambil data produk');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
  useCallback(() => {
    fetchProducts();
  }, [])
);

  const handleDelete = (id: number) => {
    Alert.alert('Hapus Produk', 'Yakin ingin menghapus produk ini?', [
      { text: 'Batal' },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.delete(`/produk/${id}`);
            fetchProducts();
          } catch (err) {
            console.log('Delete products error:', err);
            Alert.alert('Error', 'Gagal menghapus produk');
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }: { item: Product }) => (
    <View style={styles.card}>
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{item.nama_produk}</Text>
        <Text style={styles.category}>
          {item.kode_produk} • {item.nama_kategori}
        </Text>
      </View>

      <View style={{ flexDirection: 'row', gap: 12 }}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('ProductForm', {
              mode: 'edit',
              productId: item.id_produk,
            })
          }
        >
          <Icon name="edit" size={22} color="#2563eb" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handleDelete(item.id_produk)}>
          <Icon name="delete" size={22} color="red" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Navbar title="Product" />

      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={products}
          keyExtractor={item => item.id_produk.toString()}
          renderItem={renderItem}
          ListHeaderComponent={
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => navigation.navigate('ProductForm')}
            >
              <Icon name="add" size={24} color="#fff" />
              <Text style={styles.addText}>Tambah Produk</Text>
            </TouchableOpacity>
          }
          contentContainerStyle={{ paddingBottom: 120 }}
        />
      )}

      <NavBottom />
    </View>
  );
};

export default ProductScreen;
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
  category: {
    fontSize: 13,
    color: '#6b7280',
  },
});
