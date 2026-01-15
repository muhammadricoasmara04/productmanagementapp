# fix-rn.ps1

Write-Host "=== Step 1: Hapus node_modules & package-lock.json ===" -ForegroundColor Cyan
npm install -g rimraf
rimraf node_modules
Remove-Item -Force package-lock.json

Write-Host "=== Step 2: Bersihkan npm cache ===" -ForegroundColor Cyan
rimraf $env:APPDATA\npm-cache\_cacache

Write-Host "=== Step 3: Install React Native versi resmi 0.83.1 ===" -ForegroundColor Cyan
npm install react-native@0.83.1

Write-Host "=== Step 4: Install ulang dependencies ===" -ForegroundColor Cyan
npm install

Write-Host "=== Step 5: Bersihkan Metro bundler cache ===" -ForegroundColor Cyan
# Jalankan Metro bundler secara synchronous
npx react-native start --reset-cache

Write-Host "=== Step 6: Jalankan app di Android emulator ===" -ForegroundColor Cyan
npx react-native run-android
