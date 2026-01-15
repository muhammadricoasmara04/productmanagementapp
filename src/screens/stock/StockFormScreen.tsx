import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import api from '../../service/api';

interface Product {
  id_produk: number;
  nama_produk: string;
  kode_produk: string;
}

const StokFormScreen = ({ navigation, route }: any) => {
  const [produkList, setProdukList] = useState<Product[]>([]);
  const [produkId, setProdukId] = useState<number | null>(null);
  const [jumlah, setJumlah] = useState('');
  const { id_produk } = route.params || {};
  useEffect(() => {
    const fetchProduk = async () => {
      try {
        const res = await api.get('/produk');
        setProdukList(res.data);
      } catch {
        Alert.alert('Error', 'Gagal mengambil produk');
      }
    };

    fetchProduk();
  }, []);

   useEffect(() => {
    if (id_produk) {
      setProdukId(id_produk);
    }
  }, [id_produk]);

  const handleSubmit = async () => {
  if (!produkId || !jumlah) {
    Alert.alert('Error', 'Produk dan jumlah wajib diisi');
    return;
  }

  try {
    // 1. ambil semua stok
    const res = await api.get('/stok');

    // 2. cek apakah stok produk sudah ada
    const existingStok = res.data.find(
      (s: any) => s.id_produk === produkId,
    );

    if (existingStok) {
      // ✅ UPDATE stok
      const totalStok =
        Number(existingStok.jumlah_barang) + Number(jumlah);

      await api.put(`/stok/${existingStok.id_stok}`, {
        id_produk: produkId,
        jumlah_barang: totalStok,
      });
    } else {
      // ✅ CREATE stok baru
      await api.post('/stok', {
        id_produk: produkId,
        jumlah_barang: Number(jumlah),
      });
    }

    Alert.alert('Sukses', 'Stok berhasil ditambahkan');
    navigation.goBack();
  } catch (error) {
    console.log(error);
    Alert.alert('Error', 'Gagal menambahkan stok');
  }
};


  return (
    <View style={styles.container}>
      <Text style={styles.label}>Produk</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={produkId}
          onValueChange={value => setProdukId(value)}
        >
          <Picker.Item label="Pilih Produk" value={null} />
          {produkList.map(p => (
            <Picker.Item
              key={p.id_produk}
              label={`${p.kode_produk} - ${p.nama_produk}`}
              value={p.id_produk}
            />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Jumlah Stok Masuk</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={jumlah}
        onChangeText={setJumlah}
        placeholder="Masukkan jumlah"
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Tambah Stok</Text>
      </TouchableOpacity>
    </View>
  );
};

export default StokFormScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
    color: '#374151',
  },

  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
  },

  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    marginBottom: 24,
    fontSize: 14,
  },

  button: {
    backgroundColor: '#466BFF',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

