import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
  Alert,
  ScrollView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import api from '../../service/api';
import * as ImagePicker from 'react-native-image-picker';
import { Picker } from '@react-native-picker/picker';
import AppInput from '../../components/AppInput';

interface RouteParams {
  mode?: 'add' | 'edit';
  productId?: number;
}
interface Kategori {
  id_kategori: number;
  nama_kategori: string;
}

const ProductFormScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const { mode = 'add', productId } = (route.params || {}) as RouteParams;

  const [namaProduk, setNamaProduk] = useState('');
  const [foto, setFoto] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [kategoriList, setKategoriList] = useState<Kategori[]>([]);
  const [kategoriId, setKategoriId] = useState<number | null>(null);
  const [kodeProduk, setKodeProduk] = useState('');

  // Jika mode edit, ambil data produk
  useEffect(() => {
    const fetchKategori = async () => {
      try {
        const res = await api.get('/kategori');
        setKategoriList(res.data);
      } catch (err) {
        console.log(err);
        Alert.alert('Error', 'Gagal mengambil kategori');
      }
    };
    fetchKategori();
  }, []);

  useEffect(() => {
    if (mode === 'edit' && productId) {
      const fetchProduct = async () => {
        setLoading(true);
        try {
          const res = await api.get(`/produk/${productId}`);

          setNamaProduk(res.data.nama_produk);
          setKodeProduk(res.data.kode_produk);
          setKategoriId(res.data.id_kategori);

          if (res.data.foto_url) {
            setFoto({ uri: res.data.foto_url });
          }
        } catch (err) {
          console.log(err);
          Alert.alert('Error', 'Gagal mengambil data produk');
        } finally {
          setLoading(false);
        }
      };

      fetchProduct();
    }
  }, [mode, productId]);

  const pickImage = () => {
    ImagePicker.launchImageLibrary(
      { mediaType: 'photo', includeBase64: false },
      response => {
        if (response.didCancel) return;
        if (response.errorCode) {
          Alert.alert('Error', response.errorMessage || 'Gagal memilih foto');
          return;
        }
        if (response.assets && response.assets.length > 0) {
          setFoto(response.assets[0]);
        }
      },
    );
  };

  const handleSubmit = async () => {
    if (!namaProduk || !kategoriId) {
      Alert.alert('Error', 'Nama produk dan kategori wajib diisi');
      return;
    }

    const formData = new FormData();
    formData.append('nama_produk', namaProduk);
    formData.append('id_kategori', String(kategoriId));
    formData.append('kode_produk', kodeProduk);

    if (foto && foto.uri && !foto.uri.startsWith('http')) {
      formData.append('foto_produk', {
        uri: foto.uri,
        type: foto.type || 'image/jpeg',
        name: foto.fileName || 'photo.jpg',
      } as any);
    }

    setLoading(true);
    try {
      if (mode === 'add') {
        await api.post('/produk', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        Alert.alert('Sukses', 'Produk berhasil ditambahkan');
      } else if (mode === 'edit' && productId) {
        await api.put(`/produk/${productId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        Alert.alert('Sukses', 'Produk berhasil diupdate');
      }
      navigation.goBack();
    } catch (err: any) {
      console.log('Submit error:', err?.response?.data || err);
      Alert.alert(
        'Error',
        err?.response?.data?.message || 'Gagal menyimpan produk',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>
        {mode === 'add' ? 'Tambah Produk' : 'Edit Produk'}
      </Text>

      <AppInput
        label="Nama Produk"
        placeholder="Masukkan nama produk"
        value={namaProduk}
        onChangeText={setNamaProduk}
      />

      <Text style={styles.label}>Kategori</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={kategoriId}
          onValueChange={value => setKategoriId(value)}
        >
          <Picker.Item label="Pilih Kategori" value={null} />
          {kategoriList.map(k => (
            <Picker.Item
              key={k.id_kategori}
              label={k.nama_kategori}
              value={k.id_kategori}
            />
          ))}
        </Picker>
      </View>

      <AppInput
        label="Kode Produk"
        placeholder="Masukkan kode produk"
        value={kodeProduk}
        onChangeText={setKodeProduk}
      />

      <Text style={styles.label}>Foto Produk</Text>
      <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
        {foto ? (
          <Image source={{ uri: foto.uri }} style={styles.image} />
        ) : (
          <Icon name="add-a-photo" size={40} color="#666" />
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitText}>
            {mode === 'add' ? 'Tambah' : 'Update'}
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.cancelText}>Kembali</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ProductFormScreen;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 50,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '500', marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
  },
  imagePicker: {
    width: '100%',
    height: 150,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    overflow: 'hidden',
  },
  image: { width: '100%', height: '100%' },
  submitButton: {
    backgroundColor: '#466BFF',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 16,
  },
  submitText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  cancelButton: {
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#466BFF',
  },
  cancelText: { color: '#466BFF', fontWeight: '600', fontSize: 16 },
});
