# Product Management App

Aplikasi mobile berbasis **React Native CLI** untuk mengelola **produk, kategori, dan stok**.  
Aplikasi ini mendukung CRUD data, pengelolaan stok, serta autentikasi berbasis token.

---

## Fitur Utama
- Manajemen Produk (Tambah, Edit, Hapus)
- Manajemen Kategori
- Manajemen Stok Produk
- Upload & preview gambar produk
- Dashboard ringkasan (Produk, Kategori, Stok)
- Navigasi Bottom Tab
- Reusable Component (Button, Input, Navbar)
- Autentikasi Token (Async Storage)

---

## Teknologi yang Digunakan
- **React Native CLI**
- **TypeScript**
- **React Navigation**
- **Axios**
- **Async Storage**
- **React Native Vector Icons**
- **React Native Image Picker**
- **Android SDK**

---

## Hasil Output Aplikasi

### Splash Screen
<img src="src/assets/output/o-splashscreen.png" width="300" />

### Login Screen
<img src="src/assets/output/o-loginscreen.png" width="300" />

### Dashboard
<img src="src/assets/output/o-dashboardscreen.png" width="300" />

### Product Screen
<img src="src/assets/output/o-productscreen.png" width="300" />
<img src="src/assets/output/o-modalproduct.png" width="300" />
<img src="src/assets/output/o-productform.png" width="300" />

### Kategori Screen
<img src="src/assets/output/o-categoryscreen.png" width="300" />
<img src="src/assets/output/o-categoryform.png" width="300" />

### Stock Screen
<img src="src/assets/output/o-stockscreen.png" width="300" />
<img src="src/assets/output/o-modalstock.png" width="300" />
<img src="src/assets/output/o-stockform.png" width="300" />

### Profile Screen
<img src="src/assets/output/o-profilescreen.png" width="300" />
---

## 🚀 Cara Instalasi & Menjalankan Aplikasi

### 1️⃣ Prasyarat
Pastikan sudah terinstall di komputer:
- **Node.js** (disarankan versi LTS / ≥ v20)
- **npm** atau **yarn**
- **React Native CLI**
- **Android Studio**
- **Android SDK & Emulator** atau device Android fisik

Cek instalasi:
```bash
node -v
npm -v
react-native --version

1. Install Dependencies
npm install
atau
yarn install

2 Jalankan Metro Bundler
npx react-native start
Biarkan terminal ini tetap berjalan

3 Jalankan Aplikasi Android

Buka terminal baru:

npx react-native run-android


Pastikan:

Emulator Android sudah berjalan, atau

Device fisik sudah terhubung dengan USB Debugging aktif

4 Jika Terjadi Error / Crash (Opsional)
npx react-native start --reset-cache
cd android
./gradlew clean
cd ..
npx react-native run-android