# Push to GitHub — quick guide

Cara cepat push repo ini ke GitHub. (Quick steps to push this repo to GitHub.)

## 1. Buat repo kosong di GitHub

Go to <https://github.com/new>, name it **`solward`**, leave it **empty** (no README/license — they're already here), and create it.

## 2. Push dari komputer kamu

Buka terminal di folder ini (tempat `README.md` berada), lalu jalankan:

```bash
git init
git add .
git commit -m "Initial commit: Solward landing page + lite paper"
git branch -M main
git remote add origin https://github.com/<your-username>/solward.git
git push -u origin main
```

Ganti `<your-username>` dengan username GitHub kamu.

## 3. Aktifkan website gratis (GitHub Pages)

1. Repo → **Settings → Pages**.
2. **Build and deployment → Source → GitHub Actions**.
3. Selesai. Workflow yang sudah disertakan (`.github/workflows/deploy.yml`) otomatis publish folder `public/`.
4. Situs live di `https://<your-username>.github.io/solward/`.

## 4. Pakai domain solward.xyz

1. **Settings → Pages → Custom domain** → ketik `solward.xyz` → Save.
2. Di registrar domain kamu (tempat beli solward.xyz), tambahkan DNS:
   - `CNAME` record: host `www` → value `<your-username>.github.io`
   - Untuk root domain (`solward.xyz`), tambahkan 4 `A` record ke IP GitHub Pages:
     ```
     185.199.108.153
     185.199.109.153
     185.199.110.153
     185.199.111.153
     ```
3. File `public/CNAME` sudah berisi `solward.xyz`. Tunggu DNS propagate (bisa sampai beberapa jam), lalu centang **Enforce HTTPS**.

## Tips

- Mau lihat dulu sebelum push? Buka `public/index.html` langsung di browser, atau jalankan `npm run dev`.
- Setiap kali update, cukup: `git add . && git commit -m "update" && git push`. Website auto-update.
