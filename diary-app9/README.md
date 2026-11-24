# Diary App 9

Diary App menggunakan Expo Router, Redux Toolkit, Fetch API, dan REST API Express untuk operasi CRUD ke MySQL.

## Menjalankan aplikasi

1. Pastikan MySQL aktif dan database `diary_app` sudah tersedia.
2. Jalankan API dari folder `diary-api` dengan `npm run dev`.
3. Untuk Android Emulator, alamat API di `.env` mobile adalah `http://10.0.2.2:3000`. Untuk HP fisik, ganti dengan IPv4 laptop dan pastikan HP serta laptop berada pada Wi-Fi yang sama.
4. Jalankan dari folder `diary-app9` dengan `npx expo start -c`, lalu buka project di Android Emulator.

## Troubleshooting jaringan

**Gejala:** aplikasi menampilkan `Network request failed` atau tidak dapat mengambil diary.

**Penyebab umum:** aplikasi tidak dapat mencapai API lokal. `localhost` pada emulator merujuk ke emulator itu sendiri.

**Perbaikan:** gunakan `http://10.0.2.2:3000` untuk Android Emulator atau IPv4 laptop untuk HP fisik. Pastikan backend aktif di port `3000`, server mendengarkan pada `0.0.0.0`, dan firewall Windows mengizinkan koneksi. Periksa endpoint health melalui browser emulator di `http://10.0.2.2:3000/health`.

## Bukti pengujian Postman

Lampirkan screenshot respons untuk request GET semua diary, GET satu diary, POST, PUT, dan DELETE.
