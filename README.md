# 🐾 Vetpras

**Vetpras** is a crowdsourced veterinary cost comparison tool built to help pet owners make informed decisions about care — and take the mystery out of vet bills.  
Currently in active development as a solo project and product design case study.

---

## ⚡️ MVP Features

- 🧠 Supabase backend (PostgreSQL) with relational schema
- 📄 Clinic + service database with real FK integrity
- 📸 User-submitted vet bills + pricing (form + image)
- 🔍 Service-based vet search and filtering
- 🧮 Aggregated price range calculations (min, max, avg)
- 🤖 Future: AI assistant to help pet owners triage and find care

---

## 💾 Tech Stack

- **Frontend:** Next.js 15 (App Router), Tailwind CSS, JavaScript
- **Backend:** Supabase (PostgreSQL + Storage + Auth)
- **Deployment:** Vercel
- **Style:** Kebab-case file structure, Tailwind UI components (Tailwind Plus)

---

## 🔐 Current Supabase Schema

- `clinics` – Primary table of vet clinics
- `services` – Unique vet service codes and names
- `submissions` – Crowdsourced pricing with clinic/service FKs

---

## 🚧 Status

- [x] Database schema built and relational
- [x] Connected to Supabase from frontend
- [x] RLS policy set for `clinics`
- [ ] RLS policies for `services` + `submissions`
- [ ] Form UI for price submission
- [ ] Vet search page + filters
- [ ] Vercel deployment

---

## 🧱 Next Bricks

1. Create RLS policies for `services` and `submissions`
2. Build pricing form for user-submitted data
3. Create vet search UI + filters
4. Deploy to Vercel

---

## 🔄 Recent Updates

- ✅ Styled the search page drawer component
- ✅ Refined landing page layout across devices
- ✅ Prepped Hero and Header for responsive polish
- 🔄 In-progress: service search bar with dynamic filtering

---

## 🧠 Built by @jonny  
Built for curious pet owners. Powered by caffeine and ChatGPT.
