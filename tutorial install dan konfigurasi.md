# Panduan Instalasi & Konfigurasi PostgreSQL dan File `.env` - PUKI STORE

Dokumen ini berisi panduan lengkap untuk melakukan instalasi PostgreSQL pada server VPS (Ubuntu/Debian), membuat database, serta petunjuk mendalam cara mengonfigurasi seluruh variabel pada file **`.env`** proyek **PUKI STORE**.

---

## 1. Install PostgreSQL di VPS

Buka terminal dan lakukan SSH ke server VPS Anda, lalu jalankan perintah berikut:

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib -y
```

---

## 2. Membuat Database & User PostgreSQL

Masuk ke prompt interactive PostgreSQL (`psql`):

```bash
sudo -i -u postgres psql
```

Jalankan perintah SQL berikut di dalam prompt `psql`:

```sql
-- 1. Buat database baru untuk proyek
CREATE DATABASE puki_store;

-- 2. Buat user baru dengan password yang aman
CREATE USER puki_user WITH ENCRYPTED PASSWORD 'PasswordKuat123!';

-- 3. Beri hak akses penuh ke user tersebut
GRANT ALL PRIVILEGES ON DATABASE puki_store TO puki_user;
ALTER DATABASE puki_store OWNER TO puki_user;

-- Keluar dari psql
\q
```

---

## 3. Konfigurasi Remote Access (Akses dari Luar VPS)

Agar database PostgreSQL di VPS dapat diakses oleh aplikasi Anda dari komputer lokal atau server produksi:

1. **Edit file `postgresql.conf`**:
   ```bash
   sudo nano /etc/postgresql/*/main/postgresql.conf
   ```
   Cari baris `#listen_addresses = 'localhost'` lalu ubah menjadi:
   ```text
   listen_addresses = '*'
   ```
   *(Simpan dengan `Ctrl + O`, tekan `Enter`, lalu keluar dengan `Ctrl + X`)*

2. **Edit file `pg_hba.conf`**:
   ```bash
   sudo nano /etc/postgresql/*/main/pg_hba.conf
   ```
   Tambahkan baris berikut pada bagian **paling bawah**:
   ```text
   host    all             all             0.0.0.0/0               scram-sha-256
   ```

3. **Restart Service PostgreSQL**:
   ```bash
   sudo systemctl restart postgresql
   ```

4. **Buka Port 5432 pada Firewall VPS (UFW)**:
   ```bash
   sudo ufw allow 5432/tcp
   ```

---

## 4. Panduan Lengkap Konfigurasi File `.env`

File `.env` terletak di root folder proyek (`puki-store/.env`). File ini menyimpan seluruh kredensial sensitif dan konfigurasi sistem.

Berikut adalah penjelasan dan contoh pengisian untuk setiap variabel:

### ⚙️ Template Isi `.env` Lengkap

```env
# ─── Database ───
DATABASE_URL="postgresql://puki_user:PasswordKuat123!@IP_VPS_ANDA:5432/puki_store?schema=public"

# ─── Auth.js (NextAuth) ───
NEXTAUTH_SECRET="dev-secret-change-in-production-abcdef123456"
NEXTAUTH_URL="http://localhost:3000"

# ─── Google OAuth ───
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# ─── Resend (Email / OTP) ───
RESEND_API_KEY="re_your_resend_api_key_here"
EMAIL_FROM="support@puki.my.id"

# ─── KlikQRIS Payment Gateway ───
KLIKQRIS_API_KEY="your_klikqris_api_key_here"
KLIKQRIS_MERCHANT_ID="178617608180"
KLIKQRIS_BASE_URL="https://klikqris.com/api"
KLIKQRIS_CALLBACK_URL="http://localhost:3000/api/payment/callback"

# ─── App Configuration ───
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="PUKI STORE"
```

---

### 📘 Penjelasan Detail Setiap Variabel `.env`

#### A. Database (Prisma ORM)
* `DATABASE_URL`: Connection string PostgreSQL.
  * **Format**: `postgresql://<USER>:<PASSWORD>@<HOST>:<PORT>/<DATABASE_NAME>?schema=public`
  * **Contoh Lokal**: `postgresql://postgres:admin123@localhost:5432/puki_store?schema=public`
  * **Contoh VPS**: `postgresql://puki_user:PasswordKuat123!@103.123.45.67:5432/puki_store?schema=public`

#### B. Auth.js / NextAuth
* `NEXTAUTH_SECRET`: Kode rahasia untuk mengenskripsi token session / JWT.
  * *Rekomendasi Produksi*: Generate string acak 32 karakter menggunakan terminal:
    ```bash
    openssl rand -base64 32
    ```
* `NEXTAUTH_URL`: URL utama aplikasi Anda.
  * **Lokal**: `http://localhost:3000`
  * **Produksi / VPS**: `https://puki.my.id` (atau domain Anda)

#### C. Google OAuth (Login dengan Google)
* `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`: Diperoleh dari **Google Cloud Console** (APIs & Services > Credentials > OAuth 2.0 Client IDs).
  * Authorized redirect URIs yang harus didaftarkan di Google Cloud:
    `http://localhost:3000/api/auth/callback/google` (Lokal) atau `https://domain-anda.com/api/auth/callback/google` (Produksi).

#### D. Layanan Email (Resend API)
* `RESEND_API_KEY`: API Key dari dashboard [Resend.com](https://resend.com) untuk pengiriman email verifikasi dan kode OTP.
* `EMAIL_FROM`: Alamat email pengirim (misal: `support@puki.my.id` atau `noreply@domainanda.com`).

#### E. Payment Gateway (KlikQRIS)
* `KLIKQRIS_API_KEY`: Key akses API dari akun KlikQRIS Anda.
* `KLIKQRIS_MERCHANT_ID`: Merchant ID dari KlikQRIS.
* `KLIKQRIS_BASE_URL`: URL API KlikQRIS (`https://klikqris.com/api`).
* `KLIKQRIS_CALLBACK_URL`: Webhook URL untuk menerima notifikasi status pembayaran otomatis:
  * **Lokal**: `http://localhost:3000/api/payment/callback` (Gunakan Ngrok jika testing webhook lokal)
  * **Produksi**: `https://domain-anda.com/api/payment/callback`

#### F. Aplikasi Client (Next.js Public Variables)
* `NEXT_PUBLIC_APP_URL`: Base URL yang diakses oleh frontend browser.
* `NEXT_PUBLIC_APP_NAME`: Nama brand toko/aplikasi (default: `PUKI STORE`).

---

## 5. Migrasi Schema & Seeding Akun Demo

Buka terminal di komputer lokal pada folder proyek `puki-store`, lalu jalankan perintah berikut secara berurutan:

```bash
# 1. Membuat struktur tabel di database VPS / Lokal
npx prisma db push

# 2. Mengisi akun demo (Admin, Seller, Client) ke database
npx prisma db seed
```

---

## 6. Akun Login Default Setelah Seeding

Password default untuk semua akun demo di bawah adalah: **`password123`**

| Peran (Role) | Nama Account | Email | Password | Keterangan |
| :--- | :--- | :--- | :--- | :--- |
| **ADMIN** | Admin Puki Store | `admin@pukistore.com` | `password123` | Dashboard Admin & Manajemen Sistem |
| **SELLER** | Digital Corner Store | `seller@pukistore.com` | `password123` | Akses Dashboard Penjual |
| **CLIENT** | Pembeli Setia | `client@pukistore.com` | `password123` | Akses Customer / Pembeli |
