# Vetpras

**Vetpras** is a crowdsourced veterinary cost comparison tool built to help pet owners make informed decisions about care — and take the mystery out of vet bills.  
This is a solo project and product design case study currently in active development.

---

## MVP Features

- Supabase backend (PostgreSQL) with relational schema
- Clinic + service database with real FK integrity
- User-submitted vet bills + image uploads for verification
- Admin login and dashboard to review submissions
- Service-based vet search and filtering
- Aggregated price range calculations (min, max, avg)
- Future: AI assistant to help pet owners triage and find care

---

## Tech Stack

- **Frontend:** Next.js 15 (App Router), Tailwind CSS, JavaScript
- **Backend:** Supabase (PostgreSQL + Storage + Auth)
- **Deployment:** Vercel
- **Structure:** Kebab-case file structure, Tailwind UI components (Tailwind Plus)

---

## Supabase Schema

- `clinics` – Primary table of vet clinics
- `services` – Unique vet service codes and names
- `submissions` – Crowdsourced pricing with clinic/service foreign keys

---

## Current Status

- [x] Supabase schema set up and relational
- [x] RLS policy set for `clinics`
- [x] Connected to Supabase from frontend
- [x] User submission form (clinic, service, price, image)
- [x] Dynamic vet search with service filtering
- [x] Responsive layout for all major views
- [x] Project folder structure refactored and organized
- [x] Tailwind styles cleaned and scoped to components
- [x] Admin login + dashboard (Supabase Auth, RLS)
- [x] Production deployment to Vercel (live on vetpras.com)

---

## Next Bricks

1. Harden admin security (session tokens, admin list env var)
2. Improve admin dashboard UI and filters
3. Refactor submission validation and feedback tools
4. Begin drafting the AI assistant concept

---

## Recent Updates

### Release: `v0.2.0 – Secure Admin Login & Dashboard`

- Set up Supabase Auth with RLS and email login
- Created secure admin login and gated dashboard
- Built admin pages for pending bill and feedback review
- Added session handlers and permission guards
- Fully deployed live via Vercel to [vetpras.com](https://vetpras.com)
