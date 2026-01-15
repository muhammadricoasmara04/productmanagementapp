import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import Navbar from '../../components/Navbar';
import NavBottom from '../../components/NavBottom';
import api from '../../service/api';
import { getToken } from '../../utils/token';
import { useNavigation } from '@react-navigation/native';

interface Product {
  id_produk: number;
  nama_produk: string;
  nama_kategori: string;
  foto_url?: string;
}

interface Kategori {
  id_kategori: number;
  nama_kategori: string;
}

interface Stok {
  id_stok: number;
  jumlah: number;
}

const DashboardScreen = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Kategori[]>([]);
  const [stocks, setStocks] = useState<Stok[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigation = useNavigation<any>();

  useEffect(() => {
    const fetchData = async () => {
      const token = await getToken();
      if (!token) {
        navigation.replace('Login');
        return;
      }

      try {
        setLoading(true);

        // fetch produk
        const resProduk = await api.get('/produk');
        setProducts(resProduk.data);

        // fetch kategori
        const resKategori = await api.get('/kategori');
        setCategories(resKategori.data);

        // fetch stok
        const resStok = await api.get('/stok');
        setStocks(resStok.data);
      } catch (err) {
        console.log('Fetch dashboard data error:', err);
        setError('Gagal mengambil data dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigation]);

  const renderProduct = ({ item }: { item: Product }) => (
    <View style={styles.productCard}>
      {item.foto_url ? (
        <Image
          source={{ uri: item.foto_url }}
          style={styles.productImage}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.noImage}>
          <Text style={styles.noImageText}>No Image</Text>
        </View>
      )}
      <Text style={styles.productName}>{item.nama_produk}</Text>
      <Text style={styles.productDescription}>
        Kategori: {item.nama_kategori ?? '-'}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#003366" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Navbar title="Dashboard" />

      {/* Ringkasan Statistik */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryNumber}>{products.length}</Text>
          <Text style={styles.summaryLabel}>Produk</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryNumber}>{categories.length}</Text>
          <Text style={styles.summaryLabel}>Kategori</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryNumber}>{stocks.length}</Text>
          <Text style={styles.summaryLabel}>Stok</Text>
        </View>
      </View>

      {/* Produk Terbaru */}
      <View style={styles.latestProductsHeader}>
        <Text style={styles.latestTitle}>Produk Terbaru</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Product')}>
          <Text style={styles.viewAll}>Lihat Semua</Text>
        </TouchableOpacity>
      </View>

      {products.length > 0 ? (
        <FlatList
          data={products.slice(0, 5)} // 5 produk terbaru
          keyExtractor={item => item.id_produk.toString()}
          renderItem={renderProduct}
          contentContainerStyle={{ paddingBottom: 120 }}
        />
      ) : (
        <Text>Tidak ada produk</Text>
      )}

      <NavBottom />
    </View>
  );
};

export default DashboardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
  },

  // Summary
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    marginTop: 80,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    marginHorizontal: 4,
    paddingVertical: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  summaryNumber: {
    fontSize: 22,
    fontWeight: '700',
    color: '#003366',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },

  // Latest products
  latestProductsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  latestTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  viewAll: {
    color: '#466BFF',
    fontWeight: '600',
  },

  productCard: {
    padding: 12,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  productImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 8,
  },
  noImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  noImageText: {
    color: '#6b7280',
    fontSize: 14,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  productDescription: {
    fontSize: 14,
    color: '#555',
  },
});
