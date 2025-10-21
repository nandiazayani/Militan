# Proyek MILITAN DASHBOARD - Tracker

Dokumen ini adalah sumber kebenaran tunggal untuk melacak kemajuan pengembangan, fitur yang telah selesai, dan item yang akan dikerjakan selanjutnya untuk proyek Dashboard Internal PT. Mili Cipta Karya.

---

## Visi Proyek

Membangun sistem manajemen internal yang komprehensif dan terpusat untuk PT. Mili Cipta Karya. Dashboard ini akan mengintegrasikan manajemen aset, proyek, dokumen, dan pengguna, memberikan visibilitas penuh, dan meningkatkan efisiensi operasional di semua departemen.

---

## Roadmap & Status Fitur

### Fase 1: Fondasi & Modul Inti (CORE FUNCTIONALITY)

#### **Modul: Arsitektur & Antarmuka Pengguna (UI/UX)**
- **Status:** `DONE`
- **Item:**
    - `[DONE]` Desain layout utama (Sidebar, Header, Content Area).
    - `[DONE]` Skema warna dan tema gelap (dark mode) yang konsisten.
    - `[DONE]` Komponen UI dasar yang dapat digunakan kembali (reusable components).
    - `[DONE]` Struktur navigasi antar halaman.
    - `[DONE]` Styling responsif dasar untuk perangkat mobile dan desktop.

#### **Modul: Dashboard Utama**
- **Status:** `DONE`
- **Item:**
    - `[DONE]` Kartu KPI untuk metrik utama (proyek aktif, pendapatan, dll.).
    - `[DONE]` Grafik ringkasan (misalnya, perbandingan pendapatan vs pengeluaran).
    - `[DONE]` Daftar aktivitas atau proyek terkini.
    - `[DONE]` [AI] Ringkasan Kinerja AI: Tombol untuk menghasilkan analisis naratif dari data dashboard.

#### **Modul: Autentikasi & Manajemen Pengguna**
- **Status:** `DONE`
- **Item:**
    - `[DONE]` Halaman login dan logika autentikasi (simulasi).
    - `[DONE]` Manajemen sesi pengguna (login/logout).
    - `[DONE]` Tampilan daftar pengguna dengan peran dan departemen.
    - `[DONE]` Modal untuk menambah/mengedit pengguna (fungsionalitas terbatas untuk Admin).
    - `[DONE]` Halaman detail pengguna untuk melihat tugas dan informasi.
    - `[DONE]` Navigasi sidebar dinamis sesuai peran pengguna.

#### **Modul: Manajemen Proyek**
- **Status:** `DONE`
- **Item:**
    - `[DONE]` Tampilan daftar semua proyek dengan status dan PIC.
    - `[DONE]` Modal untuk menambah proyek baru.
    - `[DONE]` Halaman detail proyek yang komprehensif, mencakup:
        - `[DONE]` Ringkasan Proyek (PIC, linimasa, anggaran).
        - `[DONE]` Manajemen Tugas (CRUD, dependensi, status).
        - `[DONE]` Manajemen Pengeluaran (CRUD, upload bukti).
        - `[DONE]` Manajemen Tim.
        - `[DONE]` Manajemen Vendor.
        - `[DONE]` Riwayat Aktivitas Proyek.

#### **Modul: Manajemen Aset & Dokumen**
- **Status:** `DONE`
- **Item:**
    - `[DONE]` Halaman manajemen aset dengan daftar, status, dan tipe aset.
    - `[DONE]` CRUD penuh untuk Aset (Tambah, Edit, Hapus).
    - `[DONE]` Halaman manajemen dokumen dengan kategori, versi, dan tanggal update.
    - `[DONE]` CRUD penuh untuk Dokumen.

---

### Fase 2: Fitur Lanjutan & Integrasi AI

#### **Modul: Operasional & Laporan Harian**
- **Status:** `DONE`
- **Item:**
    - `[DONE]` Halaman Operasional untuk staf (absensi shift, akses laporan harian).
    - `[DONE]` Halaman Operasional untuk manajer (melihat kehadiran tim & daftar laporan).
    - `[DONE]` Modal untuk membuat/mengedit laporan harian (tugas, jam, lampiran).
    - `[DONE]` Kemampuan menyimpan laporan sebagai 'Draft' atau 'Submitted'.
    - `[DONE]` Mekanisme review dan feedback untuk manajer (menambahkan catatan, menyetujui laporan, dan meminta revisi).
    - `[DONE]` Visualisasi data kinerja operasional.
    - `[DONE]` Riwayat perubahan pada laporan harian.

#### **Modul: Integrasi Gemini AI**
- **Status:** `DONE`
- **Item:**
    - `[DONE]` [Dashboard] Ringkasan Kinerja AI.
    - `[DONE]` [Proyek] Asisten AI untuk analisis risiko dan rekomendasi proyek.
    - `[DONE]` [Dokumen] Pembuatan deskripsi dokumen otomatis.
    - `[DONE]` [Pengguna] Prioritas tugas otomatis di halaman detail pengguna.
    - `[DONE]` [Header] Fungsionalitas "Pencarian Cerdas" (Smart Search) untuk mencari proyek, dokumen, dan pengguna.
    - `[DONE]` Halaman "Gemini Playground" untuk interaksi langsung dengan model.
    - `[DONE]` [Notifikasi] Ringkasan notifikasi cerdas.

#### **Modul: Notifikasi & Pengaturan**
- **Status:** `DONE`
- **Item:**
    - `[DONE]` Sistem notifikasi untuk aktivitas penting (misal: tugas selesai).
    - `[DONE]` Panel notifikasi di header dengan penanda belum dibaca.
    - `[DONE]` Halaman "Semua Notifikasi" dengan fitur filter.
    - `[DONE]` Halaman Pengaturan untuk profil pengguna dan preferensi aplikasi.
    - `[DONE]` Modal untuk mengedit profil pengguna.

---

### Fase 3: Visualisasi & Utilitas

#### **Modul: Kalender & Penjadwalan**
- **Status:** `DONE`
- **Item:**
    - `[DONE]` **Kalender Terintegrasi:** Tampilan kalender untuk melihat tenggat waktu proyek, tugas, dan jadwal aset.

### Backlog & Ide Masa Depan (Fase 3+)

- `[TODO]` **Manajemen Keuangan Lanjutan:** Laporan keuangan per proyek, tracking profitabilitas real-time, integrasi dengan modul Finance.
- `[TODO]` **Kolaborasi Real-time:** Fitur komentar pada tugas dan proyek.
- `[TODO]` **Export & Reporting:** Kemampuan untuk mengekspor data (proyek, aset) ke format PDF atau Excel.
- `[TODO]` **Dashboard yang Dapat Disesuaikan:** Pengguna dapat memilih KPI atau widget yang ingin ditampilkan di dashboard mereka.
- `[TODO]` **Integrasi API Eksternal:** Menghubungkan ke layanan lain jika diperlukan.