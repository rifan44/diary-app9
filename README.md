# Praktikum 09 — Diary App + REST API

Repository ini berisi dua project sesuai struktur modul:

- `diary-api/` — REST API Express dan koneksi MySQL.
- `diary-app9/` — aplikasi React Native dengan Expo Router dan Redux Toolkit.

## Menyiapkan database dan API

1. Jalankan isi `diary-api/schema.sql` di MySQL.
2. Salin `diary-api/.env.example` menjadi `diary-api/.env`, lalu sesuaikan koneksi database.
3. Dari folder `diary-api`, jalankan `npm install`, kemudian `npm run dev`.
4. Pastikan `http://localhost:3000/health` menunjukkan database terhubung.

## Menjalankan aplikasi mobile

1. Salin `diary-app9/.env.example` menjadi `diary-app9/.env`.
2. Jalankan `npm install` dari folder `diary-app9`.
3. Untuk Android Emulator, gunakan `EXPO_PUBLIC_API_URL=http://10.0.2.2:3000`. Untuk HP fisik, gunakan IPv4 laptop dan pastikan kedua perangkat berada di Wi-Fi yang sama.
4. Dari folder `diary-app9`, jalankan `npx expo start -c`.

## Bukti praktikum

Simpan screenshot Postman untuk GET semua data, GET berdasarkan ID, POST, PUT, dan DELETE. Uji juga pencarian (`GET /api/diaries?search=kata`) serta validasi judul kurang dari 3 karakter.
