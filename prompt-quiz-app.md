## KONTEKS PROJECT

Saya sudah menjalankan `npm create vite@latest` dengan template **React + TypeScript** dan project dalam kondisi fresh install (belum ada modifikasi). Bantu saya membangun fitur lengkap dari project ini sesuai spesifikasi di bawah. Setelah selesai, bantu juga proses inisialisasi Git dan push ke GitHub.

## TUJUAN

Buat **Aplikasi Kuis** menggunakan soal dari Open Trivia Database (https://opentdb.com/), dengan login sederhana di sisi frontend, timer pengerjaan, navigasi satu soal per halaman, penyimpanan progres di localStorage (resume kuis), dan halaman hasil akhir.

## SPESIFIKASI FUNGSIONAL

1. **Login**
   - Buat file `src/data/user.ts` (atau lokasi serupa di folder `data`/`utils`) yang berisi **array daftar nama peserta kuis** yang sudah ditentukan, contoh:
     ```ts
     export const REGISTERED_USERS: string[] = [
       "Andi",
       "Budi",
       "Citra",
       "Dewi",
     ];
     ```
   - Buat halaman login dengan satu input field (nama peserta). Saat user submit:
     - Lakukan pencocokan nama yang diinput dengan isi array `REGISTERED_USERS` (case-insensitive, dan boleh `trim()` whitespace agar tidak terlalu strict).
     - Jika nama **ditemukan** di array → login berhasil, simpan nama user ke `localStorage` (sebagai sesi aktif) dan arahkan ke halaman setup/kuis.
     - Jika nama **tidak ditemukan** → tampilkan pesan error yang jelas (misal "Nama tidak terdaftar, silakan cek kembali atau hubungi panitia") dan jangan lanjutkan ke halaman kuis.
   - Tidak perlu password — cukup validasi keberadaan nama di file `user.ts` tersebut.
   - Sesi login (nama yang sedang aktif) tetap tersimpan di localStorage agar user tidak perlu login ulang setiap refresh, kecuali logout.
   - Sediakan tombol Logout yang membersihkan sesi (dan idealnya juga membersihkan progres kuis yang sedang berjalan jika diinginkan, atau biarkan tetap tersimpan untuk resume — sebutkan pertimbangan ini ke saya saat implementasi).
   - Catatan: karena `user.ts` adalah file statis di kode (bukan database), penambahan/penghapusan peserta dilakukan dengan mengedit array tersebut langsung lalu rebuild aplikasi.

2. **Sumber Soal — OpenTDB**
   - Ambil soal dari endpoint `https://opentdb.com/api.php?amount={n}` (boleh tambahkan parameter `category`, `difficulty`, `type` jika ingin memberi opsi konfigurasi ke user sebelum kuis dimulai — opsional, bebas).
   - **Decode HTML entities** pada field `question`, `correct_answer`, dan `incorrect_answers` (response OpenTDB mengandung entity seperti `&quot;`, `&amp;`, `&#039;`, dll) sebelum ditampilkan ke user.
   - Acak posisi jawaban (gabungkan `correct_answer` + `incorrect_answers`, lalu shuffle) agar jawaban benar tidak selalu di posisi yang sama.
   - Dukung kedua tipe soal dari OpenTDB: `multiple` (pilihan ganda) dan `boolean` (True/False).
   - Tangani kondisi error (gagal fetch, `response_code` selain 0, dll) dengan pesan yang jelas + opsi retry.
   - contoh response OpenTDB:
```{
  "response_code": 0,
  "results": [
    {
      "type": "multiple",
      "difficulty": "medium",
      "category": "Entertainment: Television",
      "question": "Who was the star of the TV series &quot;24&quot;?",
      "correct_answer": "Kiefer Sutherland",
      "incorrect_answers": [
        "Kevin Bacon",
        "Hugh Laurie",
        "Rob Lowe"
      ]
    },
    {
      "type": "boolean",
      "difficulty": "easy",
      "category": "Entertainment: Japanese Anime &amp; Manga",
      "question": "In Chobits, Hideki found Chii in his apartment.",
      "correct_answer": "False",
      "incorrect_answers": [
        "True"
      ]
    },
  ]
}```

3. **Konfigurasi Kuis**
   - Sebelum kuis mulai, tampilkan halaman setup untuk menentukan jumlah soal (misalnya input/slider, default bebas, contoh 10) dan durasi timer (misal dalam menit, default bebas, contoh 5 menit). Boleh juga ditambah pilihan kategori/difficulty/type jika mau.

4. **Progres Pengerjaan**
   - Tampilkan informasi "Soal X dari Y" (total soal & soal yang sedang/berapa yang sudah dikerjakan), bisa ditambah progress bar.

5. **Timer**
   - Tampilkan countdown timer yang berjalan turun dari durasi yang ditentukan di setup.
   - Timer harus tetap berjalan akurat meskipun komponen re-render (gunakan timestamp acuan, bukan hanya `setInterval` counter biasa, agar tidak drift).

6. **Navigasi Satu Soal per Halaman**
   - Tampilkan **hanya satu soal per halaman/tampilan**.
   - Begitu user memilih satu jawaban, otomatis lanjut ke soal berikutnya (tidak perlu tombol "Next" terpisah — pemilihan jawaban langsung men-trigger pindah soal, dengan sedikit delay/transisi visual agar user sempat melihat pilihannya tersimpan).
   - Jawaban yang sudah dipilih disimpan (untuk dihitung di akhir), dan tidak bisa diubah lagi setelah pindah soal.
   - Sediakan opsi soal terakhir otomatis menampilkan hasil setelah dijawab (tidak perlu menunggu timer habis jika semua soal sudah terjawab).

7. **Saat Timer Habis**
   - Jika waktu habis sebelum semua soal terjawab, kuis otomatis ditutup (soal yang belum terjawab dihitung sebagai tidak terjawab/salah) dan tampilkan halaman hasil.

8. **Halaman Hasil**
   - Tampilkan ringkasan: jumlah soal benar, jumlah soal salah, jumlah soal yang terjawab vs tidak terjawab, total soal, dan skor (persentase atau angka, bebas).
   - Sediakan tombol untuk mengulang kuis (kembali ke halaman setup) dan/atau melihat detail jawaban per soal (opsional, nilai plus).

9. **Resume Kuis (Persist State)**
   - Simpan state kuis yang sedang berjalan (daftar soal, index soal saat ini, jawaban yang sudah dipilih, sisa waktu/timestamp mulai) ke `localStorage` setiap kali ada perubahan.
   - Gunakan key localStorage yang menyertakan **nama user yang sedang login** (misal `quiz_progress_${username}`), agar jika ada lebih dari satu peserta yang memakai browser/device yang sama secara bergantian, progres kuis masing-masing peserta tidak tertukar atau saling menimpa.
   - Jika browser/tab ditutup dan dibuka kembali (atau halaman di-refresh) saat kuis belum selesai, aplikasi harus mendeteksi adanya kuis yang belum tuntas dan menawarkan untuk **resume** dari soal terakhir dengan sisa waktu yang masih sesuai (hitung sisa waktu berdasarkan selisih timestamp, bukan reset timer).
   - Setelah kuis selesai (selesai dijawab semua / waktu habis / user melihat hasil), hapus state kuis dari localStorage agar tidak ke-resume lagi.

## SPESIFIKASI TEKNIS

- Stack: React 18+ TypeScript, Vite. Boleh tambahkan `react-router-dom` untuk routing antar halaman (Login, Setup, Quiz, Result).
- Gunakan **functional components + hooks**. Pisahkan logika kuis ke dalam custom hook (misal `useQuiz`, `useTimer`) agar komponen tetap bersih.
- Tipekan semua data dengan interface/type TypeScript yang jelas (misal `Question`, `QuizState`, `QuizConfig`, `QuizResult`).
- Gunakan `fetch` (atau `axios` jika lebih nyaman) untuk request ke OpenTDB, dengan loading state & error state yang ditangani di UI.
- Struktur folder yang rapi, contoh:
  ```
  src/
    components/
    pages/
    hooks/
    types/
    utils/      // termasuk util decode HTML entity & shuffle array
    services/   // api client untuk opentdb
  ```
- Pastikan aplikasi responsif (mobile-friendly).

## TEMA DESAIN — NEO-BRUTALISM

Desain frontend menggunakan gaya **neo-brutalism**: tampilan tegas, raw, dan kontras tinggi. Beberapa ciri yang bisa diterapkan (bebas berkreasi, tidak harus semua):
- Border tebal & solid (misal 3–5px hitam) pada card/button/input, tanpa border-radius (sudut tajam) atau radius minimal sebagai aksen.
- Hard shadow / offset shadow (drop shadow tanpa blur, contoh `box-shadow: 6px 6px 0 #000`) yang bergeser saat elemen di-hover/klik untuk efek "tekanan".
- Palet warna berani & kontras tinggi (contoh: kuning, hitam, merah/cyan/pink terang sebagai aksen di atas latar putih/krem).
- Tipografi tebal, besar, sedikit "kasar" — gunakan font sans-serif/monospace yang bold untuk heading.
- Elemen interaktif (tombol jawaban, timer, kartu soal) terasa fisik/tactile: efek transform saat ditekan, tanpa gradient halus atau shadow lembut bergaya "modern minimal".
- Bebas memilih CSS biasa, CSS Modules, atau Tailwind CSS untuk implementasinya — silakan AI pilih yang paling efisien untuk project ini.

## UPLOAD KE GITHUB

Setelah aplikasi selesai dan berjalan lokal (`npm run dev` berhasil tanpa error):
1. Buat/lengkapi file `.gitignore` (pastikan `node_modules`, `dist`, `.env` diabaikan).
2. Tulis `README.md` yang menjelaskan: deskripsi project, fitur, cara install & run (`npm install`, `npm run dev`), screenshot (jika memungkinkan dijelaskan tempatnya), dan catatan teknis (misal sumber API, mekanisme resume).
3. Jalankan `git init` (jika belum), `git add .`, `git commit -m "..."` dengan pesan commit yang jelas.
4. Berikan instruksi langkah-demi-langkah untuk saya membuat repository baru di GitHub dan melakukan `git remote add origin <url>` lalu `git push -u origin main`, karena proses pembuatan repo & autentikasi GitHub perlu saya lakukan sendiri di akun saya.

## CATATAN TAMBAHAN

- Tangani edge case: jumlah soal yang diminta melebihi yang tersedia di kategori tertentu (OpenTDB akan mengembalikan `response_code` 1), beri pesan error yang jelas.
- Tangani race condition: jika user mengklik jawaban dua kali dengan cepat, pastikan tidak ada duplikasi perpindahan soal.
- Pastikan tidak ada memory leak pada timer (`clearInterval`/`clearTimeout` di cleanup `useEffect`).
- Tuliskan kode dengan komentar singkat di bagian logika penting (timer, resume, scoring).
