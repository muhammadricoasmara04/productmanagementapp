import React, { useState, useCallback } from 'react';
import {
  View,
  Modal,
  Image,
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
import FabButton from '../../components/FabButton';
import NavBottom from '../../components/NavBottom';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { formatDateID } from '../../utils/formatedate';

interface Product {
  id_produk: number;
  nama_produk: string;
  nama_kategori: string;
  kode_produk: string;
  foto_url?: string;
  stok?: number;
  tgl_register?: string;
}

interface Stok {
  id_stok: number;
  id_produk: number;
  jumlah_barang: number;
}

const ProductScreen = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation<any>();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const [produkRes, stokRes] = await Promise.all([
        api.get<Product[]>('/produk'),
        api.get<Stok[]>('/stok'),
      ]);

      const mergedData = produkRes.data.map(prod => {
        const stok = stokRes.data.find(s => s.id_produk === prod.id_produk);

        return {
          ...prod,
          stok: stok ? stok.jumlah_barang : 0,
        };
      });

      setProducts(mergedData);
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
    }, []),
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
      <TouchableOpacity
        style={{ flex: 1 }}
        onPress={() => {
          setSelectedProduct(item);
          setModalVisible(true);
        }}
      >
        <Text style={styles.name}>{item.nama_produk}</Text>
        <Text style={styles.category}>
          {item.kode_produk} • {item.nama_kategori}
        </Text>
        <Text style={styles.stock}>Stok: {item.stok}</Text>
      </TouchableOpacity>

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

        <TouchableOpacity
          onPress={() => {
            if (item.stok && item.stok > 0) {
              Alert.alert('Tidak bisa dihapus', 'Produk masih memiliki stok');
              return;
            }
            handleDelete(item.id_produk);
          }}
        >
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
          contentContainerStyle={{ paddingBottom: 120 }}
        />
      )}

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Detail Produk</Text>

            {selectedProduct?.foto_url ? (
              <Image
                source={{ uri: selectedProduct.foto_url }}
                style={styles.productImage}
              />
            ) : (
              <View style={styles.noImage}>
                <Text style={styles.noImageText}>No Image</Text>
              </View>
            )}

            <Text style={styles.modalText}>
              Nama: {selectedProduct?.nama_produk}
            </Text>
            <Text style={styles.modalText}>
              Kode: {selectedProduct?.kode_produk}
            </Text>
            <Text style={styles.modalText}>
              Kategori: {selectedProduct?.nama_kategori}
            </Text>
            <Text>
              Dibuat: {formatDateID(selectedProduct?.tgl_register)}
            </Text>
            <Text style={styles.modalText}>Stok: {selectedProduct?.stok}</Text>

            <TouchableOpacity
              style={styles.editButton}
              onPress={() => {
                setModalVisible(false);
                navigation.navigate('ProductForm', {
                  mode: 'edit',
                  productId: selectedProduct?.id_produk,
                });
              }}
            >
              <Icon name="edit" size={20} color="#fff" />
              <Text style={styles.editButtonText}>Edit Produk</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.stockButton}
              onPress={() => {
                setModalVisible(false);
                navigation.navigate('StockForm', {
                  id_produk: selectedProduct?.id_produk,
                  nama_produk: selectedProduct?.nama_produk,
                });
              }}
            >
              <Icon name="add-circle-outline" size={20} color="#fff" />
              <Text style={styles.stockButtonText}>Tambah Stok</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeText}>Tutup</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <FabButton
        icon="add"
        onPress={() => navigation.navigate('ProductForm')}
      />

      <NavBottom />
    </View>
  );
};

export default ProductScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#dedede',
    paddingHorizontal: 16,
    paddingTop: 100,
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  category: {
    fontSize: 13,
    color: '#6b7280',
  },
  stock: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: '600',
    color: '#2563eb',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  modalText: {
    fontSize: 14,
    marginBottom: 6,
    color: '#374151',
  },
  productImage: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginBottom: 12,
  },
  noImage: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  noImageText: {
    color: '#6b7280',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563eb',
    padding: 14,
    borderRadius: 8,
    marginTop: 16,
  },
  editButtonText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 6,
  },
  closeButton: {
    alignItems: 'center',
    marginTop: 12,
  },
  closeText: {
    color: '#6b7280',
  },
  stockButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#16a34a', // hijau = stok
    padding: 14,
    borderRadius: 8,
    marginTop: 12,
  },

  stockButtonText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 6,
  },
});
