import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import api from '../../service/api';
import Navbar from '../../components/Navbar';

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
        // UPDATE
        await api.put(`/kategori/${category.id_kategori}`, {
          nama_kategori: namaKategori,
        });
        Alert.alert('Sukses', 'Kategori berhasil diperbarui');
      } else {
        // CREATE
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
        <Text style={styles.label}>Nama Kategori</Text>
        <TextInput
          style={styles.input}
          placeholder="Masukkan nama kategori"
          value={namaKategori}
          onChangeText={setNamaKategori}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>
              {isEdit ? 'Update' : 'Simpan'}
            </Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backText}>Kembali</Text>
        </TouchableOpacity>
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
