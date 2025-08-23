// src/app/layout.jsx

import '@/styles/tailwind.css';
import { Inter } from 'next/font/google';
import Footer from '@/components/layout/footer';
import Header from '@/components/layout/header';
import ScrollToTop from '@/components/ui/scroll-to-top';
import Script from 'next/script';
import SessionHandler from '@/components/system/session-handler';
import SupabaseProvider from '@/components/system/supabase-provider'; // ✅ New

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Vetpras | Transparent Vet Pricing',
  description: 'Vetpras helps pet owners compare prices and find trusted veterinary clinics in BC.',
};

// ✅ Server component layout wrapped in client-side auth context
export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      <body className="bg-white text-gray-900 antialiased">
        {/* Analytics & Tracking */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-4YY2JG7YNQ"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-4YY2JG7YNQ');
          `}
        </Script>
        <Script id="hotjar-contentsquare" strategy="afterInteractive">
          {`
            (function (c, s, q, u, a, r, e) {
              c.hj = c.hj || function() {(c.hj.q = c.hj.q || []).push(arguments)};
              c._hjSettings = { hjid: 6386067 };
              r = s.getElementsByTagName('head')[0];
              e = s.createElement('script');
              e.async = true;
              e.src = q + c._hjSettings.hjid + u;
              r.appendChild(e);
            })(window, document, 'https://static.hj.contentsquare.net/c/csq-', '.js', 6386067);
          `}
        </Script>

        {/* ✅ Supabase session context wrapper */}
        <SupabaseProvider>
          <Header />
          <SessionHandler />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <ScrollToTop />
        </SupabaseProvider>
      </body>
    </html>
  );
}
