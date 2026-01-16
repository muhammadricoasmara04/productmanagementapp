import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Modal,
  Image,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import api from '../../service/api';
import Navbar from '../../components/Navbar';
import NavBottom from '../../components/NavBottom';
import FabButton from '../../components/FabButton';
interface Stok {
  id_stok: number;
  id_produk: number;
  nama_produk: string;
  kode_produk: string;
  jumlah_barang: number;
  foto_url?: string;
}

const StokScreen = () => {
  const navigation = useNavigation<any>();
  const [stokList, setStokList] = useState<Stok[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedStok, setSelectedStok] = useState<Stok | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const fetchStok = async () => {
    setLoading(true);
    try {
      const [stokRes, produkRes] = await Promise.all([
        api.get('/stok'),
        api.get('/produk'),
      ]);

      const mergedData = stokRes.data.map((stok: Stok) => {
        const produk = produkRes.data.find(
          (p: any) => p.id_produk === stok.id_produk,
        );

        return {
          ...stok,
          foto_url: produk?.foto_url,
        };
      });

      setStokList(mergedData);
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Gagal mengambil data stok');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchStok();
    }, []),
  );

  const handleDelete = (id: number) => {
    Alert.alert('Hapus Stok', 'Yakin ingin menghapus stok ini?', [
      { text: 'Batal' },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.delete(`/stok/${id}`);
            fetchStok();
          } catch {
            Alert.alert('Error', 'Gagal menghapus stok');
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }: { item: Stok }) => (
    <View style={styles.card}>
      <TouchableOpacity
        style={{ flex: 1 }}
        onPress={() => {
          setSelectedStok(item);
          setModalVisible(true);
        }}
      >
        <Text style={styles.title}>{item.nama_produk}</Text>
        <Text style={styles.subtitle}>
          {item.kode_produk} • Stok: {item.jumlah_barang}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => handleDelete(item.id_stok)}>
        <Icon name="delete" size={24} color="red" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Navbar title="Stock" />
      <FlatList
        data={stokList}
        keyExtractor={item => item.id_stok.toString()}
        renderItem={renderItem}
        refreshing={loading}
        onRefresh={fetchStok}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 20 }}>
            Data stok kosong
          </Text>
        }
      />
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Detail Stok</Text>
            {selectedStok?.foto_url ? (
              <Image
                source={{ uri: selectedStok.foto_url }}
                style={styles.productImage}
              />
            ) : (
              <View style={styles.noImage}>
                <Text style={styles.noImageText}>No Image</Text>
              </View>
            )}

            <Text style={styles.modalText}>
              Produk: {selectedStok?.nama_produk}
            </Text>
            <Text style={styles.modalText}>
              Kode: {selectedStok?.kode_produk}
            </Text>
            <Text style={styles.modalText}>
              Jumlah Stok: {selectedStok?.jumlah_barang}
            </Text>

            <TouchableOpacity
              style={styles.addButton}
              onPress={() => {
                setModalVisible(false);
                navigation.navigate('StockForm', {
                  id_produk: selectedStok?.id_produk,
                });
              }}
            >
              <Icon name="add" size={20} color="#fff" />
              <Text style={styles.addButtonText}>Tambah Stok</Text>
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
      <FabButton icon="add" onPress={() => navigation.navigate('StockForm')} />
      <NavBottom />
    </View>
  );
};

export default StokScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  listContent: {
    paddingTop: 80,
    paddingBottom: 100,
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

  title: { fontSize: 16, fontWeight: 'bold' },
  subtitle: { color: '#666', marginTop: 4 },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 80,
    backgroundColor: '#466BFF',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
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

  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#466BFF',
    padding: 14,
    borderRadius: 8,
    marginTop: 16,
  },

  addButtonText: {
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
});
