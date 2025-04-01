import '@/styles/tailwind.css'
import Header from '@/components/header'
import Footer from '@/components/footer'

export const metadata = {
  title: "Vetpras",
  description: "Crowdsourced vet pricing & clinic comparison",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-white text-zinc-900 font-inter">
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
