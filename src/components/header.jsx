"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-colors duration-300 ${
        isScrolled ? "bg-white shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="px-6 py-4 flex items-center justify-between">
        <Link href="/">
          <img
            src="/vetpras-logov2.png"
            alt="Vetpras logo"
            className="h-10 w-auto"
          />
        </Link>
        <nav className="hidden md:flex space-x-6 text-sm font-medium text-body-md text-secondary-text">
          <Link href="/" className="hover:text-black">
            Home
          </Link>
          <Link href="/clinics" className="hover:text-black">
            Vet Search
          </Link>
          <Link href="/submit" className="hover:text-black">
            Submit Bill
          </Link>
          <Link href="/feedback" className="hover:text-black">
            Submit Feedback
          </Link>
        </nav>
      </div>
    </header>
  )
}
