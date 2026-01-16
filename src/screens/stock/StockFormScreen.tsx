import React, { useEffect, useState } from 'react';
import { View, Text, Alert, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import api from '../../service/api';
import AppButton from '../../components/AppButton';
import AppInput from '../../components/AppInput';

interface Product {
  id_produk: number;
  nama_produk: string;
  kode_produk: string;
}

const StokFormScreen = ({ navigation, route }: any) => {
  const [produkList, setProdukList] = useState<Product[]>([]);
  const [produkId, setProdukId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [jumlah, setJumlah] = useState('');
  const { id_produk } = route.params || {};
  useEffect(() => {
    const fetchProduk = async () => {
      try {
        setLoading(true);
        const res = await api.get('/produk');
        setProdukList(res.data);
      } catch {
        Alert.alert('Error', 'Gagal mengambil produk');
      } finally {
        setLoading(false);
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
      setLoading(true);
      const res = await api.get('/stok');
      const existingStok = res.data.find((s: any) => s.id_produk === produkId);

      if (existingStok) {
        const totalStok = Number(existingStok.jumlah_barang) + Number(jumlah);

        await api.put(`/stok/${existingStok.id_stok}`, {
          id_produk: produkId,
          jumlah_barang: totalStok,
        });
      } else {
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
    } finally {
      setLoading(false);
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
      <AppInput
        label="Jumlah"
        placeholder="Masukkan jumlah"
        value={jumlah}
        onChangeText={setJumlah}
        keyboardType="numeric"
      />

      <AppButton title="Tambah Stok" onPress={handleSubmit} loading={loading} />

      <AppButton
        title="Kembali"
        variant="secondary"
        onPress={() => navigation.goBack()}
      />
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
