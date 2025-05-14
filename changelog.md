## [v0.2.0] - 2025-05-13

### ✨ Added

- Secure admin login flow using Supabase magic link
- Admin dashboard at `/admin/dashboard`
- Sub-pages to view:
  - Pending bill submissions
  - Feedback submissions

### 🔐 Security

- Admin-only access with email-based role check
- Session-based route protection

### 🧹 Cleanup

- Removed unused SVGs and public assets
- Refactored feedback logic into `normalize-feedback.js`

### 🛠 Internal

- Introduced `session-handler.jsx` and `supabase-provider.jsx`
- Connected live Supabase instance to Vercel prod environment
