// src/app/layout.jsx

import '@/styles/tailwind.css';
import { Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import Footer from '@/components/layout/footer';
import Header from '@/components/layout/header';
import ScrollToTop from '@/components/ui/scroll-to-top';
import Script from 'next/script';
import SessionHandler from '@/components/system/session-handler';
import SupabaseProvider from '@/components/system/supabase-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Vetpras | Transparent Vet Pricing',
  description: 'Vetpras helps pet owners compare prices and find trusted veterinary clinics in BC.',
};

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

        {/* Hotjar Tracking */}
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

        {/* Facebook Pixel */}
        <Script id="facebook-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '630248853222534');
            fbq('track', 'PageView');
          `}
        </Script>

        {/* Facebook Pixel NoScript Fallback */}
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=630248853222534&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>

        <SupabaseProvider>
          <Header />
          <SessionHandler />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <ScrollToTop />
        </SupabaseProvider>

        <Analytics />
      </body>
    </html>
  );
}
