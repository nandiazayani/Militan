# MILITAN - Project Tracker

Dokumen ini melacak kemajuan pengembangan dan daftar fitur untuk dasbor internal MILITAN (PT. Mili Cipta Karya).

---

## Modul Utama

### 1. Dashboard (`modules/dashboard`)
- **Status**: [x] Selesai
- **Fitur**:
  - [x] Kartu KPI (Proyek Aktif, Total Pendapatan, Total Pengeluaran, Margin Profit).
  - [x] Grafik analitik pendapatan vs pengeluaran proyek.
  - [x] Daftar aktivitas proyek terkini.
  - [ ] **(Next)** Filter dashboard berdasarkan rentang waktu.

### 2. Manajemen Aset (`modules/assets`)
- **Status**: [x] Selesai
- **Fitur**:
  - [x] Melihat daftar semua aset perusahaan.
  - [x] Filter dan pencarian aset.
  - [x] Badge status aset yang jelas (Available, In Use, Maintenance, dll.).
  - [x] Menambah Aset Baru.
  - [x] Mengedit detail aset yang ada.
  - [x] Menghapus aset (dengan konfirmasi).
  - [ ] **(Next)** Melihat riwayat pemakaian dan maintenance setiap aset.

### 3. Manajemen Proyek (`modules/projects`)
- **Status**: [x] Selesai (Setelah Refactor)
- **Fitur**:
  - **3.1. Halaman Utama Proyek**
    - [x] Melihat daftar semua proyek.
    - [x] Kartu ringkasan (Total Proyek, Proyek Berjalan, Total Anggaran).
    - [x] Menambah proyek baru - *Hanya untuk Admin/Manajer*.
    - [x] Navigasi ke halaman detail proyek.
  - **3.2. Detail Proyek (Direfaktor menjadi komponen terpisah)**
    - [x] Melihat ringkasan keuangan (Anggaran, Pemasukan, Pengeluaran, Profit).
    - [x] Melihat PIC (Person in Charge) proyek.
    - [x] Melihat daftar anggota tim proyek.
    - **Manajemen Vendor**
        - [x] Menambah vendor baru ke proyek.
        - [x] Mengedit informasi vendor.
        - [x] Menghapus vendor dari proyek.
    - **Manajemen Tugas**
        - [x] Menambah tugas baru untuk anggota tim (termasuk pemilihan prioritas).
        - [x] Melihat daftar tugas beserta status dan penanggung jawab.
        - [x] Mengedit detail tugas yang ada.
        - [x] Menentukan dependensi antar tugas (prasyarat).
        - [x] Indikator visual untuk tugas yang terblokir oleh dependensi.
        - [x] Menghapus tugas (dengan pengaman agar tidak menghapus tugas yang menjadi prasyarat).
    - **Manajemen Pengeluaran**
      - [x] Melihat daftar pengeluaran.
      - [x] Filter pengeluaran berdasarkan status.
      - [x] Menambah pengeluaran baru dengan status "Menunggu".
      - [x] Mengedit pengeluaran yang ada.
      - [x] Menghapus pengeluaran.
      - [x] Mengunggah beberapa bukti pembayaran untuk satu pengeluaran.
    - **Riwayat Proyek**
        - [x] Melihat log aktivitas otomatis untuk setiap perubahan penting (tugas, vendor, pengeluaran).
  - [ ] **(Next)** Mentransfer PIC (Person in Charge) proyek (termasuk pencatatan riwayat).
  - [ ] **(Next)** Mentransfer tugas ke anggota tim lain.
  - [ ] **(Next)** Mengubah status pengeluaran (Disetujui, Ditolak) - *Hanya untuk Admin/Manajer/Finance*.
  - [ ] **(Next)** Arsipkan proyek.


### 4. Manajemen Dokumen (`modules/documents`)
- **Status**: [x] Selesai
- **Fitur**:
  - [x] Unggah dokumen baru dengan metadata (kategori, deskripsi, tags).
  - [x] Melihat daftar dokumen dengan ikon berdasarkan tipe file.
  - [x] Pencarian berdasarkan nama atau tag.
  - [x] Filter berdasarkan kategori dokumen.
  - [ ] **(Next)** Fitur pratinjau dan unduh dokumen.
  - [ ] **(Next)** Manajemen versi dokumen.

### 5. Manajemen Pengguna (`modules/users`)
- **Status**: [ ] Sebagian Selesai
- **Fitur**:
    - **5.1. Halaman Utama Pengguna**
      - [x] Melihat daftar semua pengguna.
      - [x] Navigasi ke halaman detail pengguna.
      - [x] Menambah pengguna baru - *Hanya untuk Admin*.
    - **5.2. Detail Pengguna**
      - [x] Melihat profil dan detail kontak pengguna.
      - [x] Mengedit profil pengguna - *Hanya untuk Admin atau pengguna sendiri*.
      - [x] Melihat ringkasan kinerja (KPI).
      - [x] Menambah tugas baru untuk pengguna.
      - [x] Melihat dan mengelola daftar tugas pengguna (Edit, Hapus, Tandai Selesai).
      - [x] Mengurutkan tugas berdasarkan prioritas atau tanggal tenggat.
      - [ ] **(Next)** Nonaktifkan pengguna.

### 6. Departemen Tambahan (`modules/departments`)
- **Status**: [x] Selesai
- **Fitur**:
  - [x] Halaman khusus untuk melihat kinerja departemen/lini bisnis lain (TerusBerjalan.id, Cecikal, dll.).
  - [x] Tampilan data kunci: Tugas Aktif, Tingkat Penyelesaian, Pencapaian.
  - [x] Ringkasan status laporan (Mingguan, Bulanan).

### 7. Pengaturan (`modules/settings`)
- **Status**: [x] Selesai
- **Fitur**:
  - [x] Melihat profil pengguna yang sedang login.
  - [x] Mengedit profil sendiri (nama, departemen, avatar).
  - [x] Mengaktifkan/menonaktifkan mode gelap (Dark Mode).
  - [x] Mengelola pengaturan fungsionalitas seperti Auto-Save.
  - [x] Implementasi Auto-Save:
    - [x] Menyimpan draf form (misal: pengeluaran, vendor, tugas) secara otomatis ke localStorage jika fitur diaktifkan.
    - [x] Menampilkan indikator di header jika ada perubahan yang belum disimpan.
    - [x] Menawarkan pemulihan data saat form dibuka kembali.
  - [ ] **(Next)** Pengaturan notifikasi yang lebih detail.
  - [ ] **(Next)** Fitur ubah kata sandi.

---

## Legenda Status
- **[x] Selesai**: Fitur telah diimplementasikan dan berfungsi sesuai harapan.
- **[ ] Sebagian Selesai**: Fitur sedang dalam pengembangan atau baru sebagian yang berfungsi.
- **[ ] Belum Dikerjakan**: Fitur belum mulai dikembangkan.
- **(Next)**: Prioritas pengembangan selanjutnya.