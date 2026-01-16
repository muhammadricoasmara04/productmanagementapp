import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import api from '../../service/api';
import Navbar from '../../components/Navbar';
import AppButton from '../../components/AppButton';
import AppInput from '../../components/AppInput';

interface Category {
  id_kategori: number;
  nama_kategori: string;
}

const CategoryForm = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const category: Category | undefined = route.params?.category;

  const [namaKategori, setNamaKategori] = useState('');
  const [loading, setLoading] = useState(false);

  const isEdit = !!category;

  useEffect(() => {
    if (category) {
      setNamaKategori(category.nama_kategori);
    }
  }, [category]);

  const handleSubmit = async () => {
    if (!namaKategori.trim()) {
      Alert.alert('Validasi', 'Nama kategori wajib diisi');
      return;
    }

    setLoading(true);
    try {
      if (isEdit) {
        await api.put(`/kategori/${category.id_kategori}`, {
          nama_kategori: namaKategori,
        });
        Alert.alert('Sukses', 'Kategori berhasil diperbarui');
      } else {
        await api.post('/kategori', {
          nama_kategori: namaKategori,
        });
        Alert.alert('Sukses', 'Kategori berhasil ditambahkan');
      }
      navigation.goBack();
    } catch (err) {
      console.log('Save category error:', err);
      Alert.alert('Error', 'Gagal menyimpan kategori');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Navbar title={isEdit ? 'Edit Kategori' : 'Tambah Kategori'} />

      <View style={styles.form}>

         <AppInput
        label="Nama Produk"
        placeholder="Masukkan nama produk"
        value={namaKategori}
        onChangeText={setNamaKategori}
      />

        <AppButton
          title={isEdit ? 'Update' : 'Simpan'}
          onPress={handleSubmit}
          loading={loading}
        />
        <AppButton
          title="Kembali"
          variant="secondary"
          onPress={() => navigation.goBack()}
        />
      </View>
    </View>
  );
};

export default CategoryForm;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 100,
  },
  form: {
    marginTop: 20,
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#466BFF',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  backButton: {
    marginTop: 12,
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#466BFF',
    alignItems: 'center',
  },
  backText: {
    color: '#466BFF',
    fontWeight: '600',
  },
});
