// src/app/layout.jsx

import '@/styles/tailwind.css'; // Tailwind base styles
import { Inter } from 'next/font/google'; // Optional font import
import Footer from '@/components/layout/footer'; // Shared footer
import Header from '@/components/layout/header'; // Shared header
import ScrollToTop from '@/components/ui/scroll-to-top'; // Scroll-to-top button
import Script from 'next/script'; // Script loader for Google Analytics and Hotjar

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Vetpras | Transparent Vet Pricing',
  description: 'Vetpras helps pet owners compare prices and find trusted veterinary clinics in BC.',
};

// 🔧 Root layout for the entire app
export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      <body className="bg-white text-gray-900 antialiased">
        {/* Google Analytics */}
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

        {/* Hotjar + Contentsquare Integration */}
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

        {/* Shared header */}
        <Header />

        {/* Main content area */}
        <main className="min-h-screen">{children}</main>

        {/* Shared footer */}
        <Footer />

        {/* Scroll to top button */}
        <ScrollToTop />
      </body>
    </html>
  );
}
