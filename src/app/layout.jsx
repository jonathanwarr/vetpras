// src/app/layout.jsx

import '@/styles/tailwind.css'; // Tailwind base styles
import { Inter } from 'next/font/google'; // Optional: replace with your chosen font
import Footer from '@/components/layout/footer'; // Assumes Footer is a shared component
import Header from '@/components/layout/header'; // Will be used across all pages
import ScrollToTop from '@/components/ui/scroll-to-top'; //Chevron to return to top of page

// Load the Inter font and set it as the global font
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
        {/* Shared header across all pages */}
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
