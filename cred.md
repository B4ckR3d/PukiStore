# Login Credentials & Environment Setup - PUKI STORE

Berikut adalah daftar akun demo/seeded dan kredensial lingkungan yang digunakan dalam proyek **PUKI STORE**.

---

## 1. Akun Login (Demo Users)

Semua akun demo di bawah ini menggunakan kata sandi default: **`password123`**

| Peran (Role) | Nama Account | Email | Password | Keterangan |
| :--- | :--- | :--- | :--- | :--- |
| **ADMIN** | Admin Puki Store | `admin@pukistore.com` | `password123` | Akses penuh dashboard Admin & Manajemen Sistem |
| **SELLER** | Digital Corner Store | `seller@pukistore.com` | `password123` | Toko: **Digital Corner** (`digital-corner`) |
| **CLIENT** | Pembeli Setia | `client@pukistore.com` | `password123` | Akun Pembeli / Customer |

---

## 2. Environment Variables (`.env`)

| Variable | Value / Usage | Keterangan |
| :--- | :--- | :--- |
| `DATABASE_URL` | `postgresql://user:password@localhost:5432/puki_store?schema=public` | PostgreSQL Database Connection |
| `NEXTAUTH_SECRET` | `dev-secret-change-in-production` | Auth.js / NextAuth Secret Token |
| `NEXTAUTH_URL` | `http://localhost:3000` | Base URL Aplikasi |
| `EMAIL_FROM` | `support@puki.my.id` | Resend Sender Email |
| `KLIKQRIS_MERCHANT_ID` | `178617608180` | Merchant ID KlikQRIS Payment Gateway |
