# Quiz App

Aplikasi kuis interaktif berbasis React + TypeScript yang mengambil soal dari [Open Trivia Database (OpenTDB)](https://opentdb.com/). Dilengkapi login sederhana, timer, navigasi satu soal per halaman, penyimpanan progres di localStorage, dan halaman hasil.

## Fitur

- **Login** — validasi nama terhadap daftar peserta terdaftar (`src/data/user.ts`)
- **Setup kuis** — atur jumlah soal, durasi timer, tingkat kesulitan, dan tipe soal
- **Soal dari OpenTDB** — decode HTML entities, acak posisi jawaban, dukung pilihan ganda & True/False
- **Timer** — countdown berbasis timestamp (tidak drift saat re-render)
- **Satu soal per halaman** — auto-lanjut setelah memilih jawaban
- **Resume kuis** — progres tersimpan per user di localStorage
- **Halaman hasil** — ringkasan skor + detail jawaban per soal

## Tech Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS v4
- React Router DOM

## Cara Install & Menjalankan

```bash
npm install
npm run dev
```

Buka browser di alamat yang ditampilkan (biasanya `http://localhost:5173`).

### Build Production

```bash
npm run build
npm run preview
```

## Cara Login

Gunakan salah satu nama peserta yang terdaftar di `src/data/user.ts`:

- Andi
- Budi
- Citra
- Dewi

Untuk menambah/menghapus peserta, edit array `REGISTERED_USERS` lalu rebuild aplikasi.

## Catatan Teknis

### API Soal

Soal diambil dari endpoint:

```
https://opentdb.com/api.php?amount={n}
```

Parameter opsional: `category`, `difficulty`, `type`.

### Mekanisme Resume

State kuis disimpan di localStorage dengan key `quiz_progress_{username}` yang mencakup:

- daftar soal
- index soal saat ini
- jawaban yang sudah dipilih
- timestamp mulai & durasi

Sisa waktu dihitung dari selisih `Date.now()` dengan `startedAt`, bukan counter interval biasa.

### Logout

Logout hanya menghapus sesi aktif (`quiz_session`). Progres kuis tetap tersimpan agar peserta bisa melanjutkan saat login kembali dengan nama yang sama.

### Struktur Folder

```
src/
  components/   # UI reusable
  pages/        # Login, Setup, Quiz, Result
  hooks/        # useQuiz, useTimer
  context/      # Auth & Quiz state
  types/        # TypeScript interfaces
  utils/        # decode HTML, shuffle, storage, scoring
  services/     # OpenTDB API client
  data/         # Daftar peserta terdaftar
```
