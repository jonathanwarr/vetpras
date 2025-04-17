# Vetpras

**Vetpras** is a crowdsourced veterinary cost comparison tool built to help pet owners make informed decisions about care — and take the mystery out of vet bills.  
This is a solo project and product design case study currently in active development.

---

## MVP Features

- Supabase backend (PostgreSQL) with relational schema
- Clinic + service database with real FK integrity
- User-submitted vet bills + image uploads for verification
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
- [ ] RLS policies for `services` + `submissions`
- [ ] Vercel deployment

---

## Next Bricks

1. Add RLS policies for `services` and `submissions`
2. QA service filtering logic and form validation
3. Deploy to Vercel with production keys
4. Begin drafting the AI assistant concept

---

## Recent Updates

- Completed full folder restructure for components, content, styles, and Supabase logic
- Cleaned up Tailwind styling for global consistency
- Removed unused legacy styles (`prism.css`, old typography files)
- Built search drawer, pricing table, and form submission UI
- Created placeholder components for buttons, pagination, modals

---

## Built by @jonny

Designed, developed, and documented as a solo project. Contributions welcome.
