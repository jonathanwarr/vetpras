import '@/styles/tailwind.css';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';

export const metadata = {
  title: 'Vetpras',
  description: 'Crowdsourced vet pricing & clinic comparison',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-inter bg-white text-zinc-900">
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
