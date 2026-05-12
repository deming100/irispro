"use client";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-[32px] left-0 right-0 z-40 bg-[#0A0A0A]/90 backdrop-blur border-b border-[#2A2A2A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold">
              <span className="text-[#C9A84C]">Iris</span>
              <span className="text-white">Pro</span>
            </span>
            <span className="text-xs text-gray-400 hidden sm:block border border-[#C9A84C]/30 text-[#C9A84C] px-2 py-0.5 rounded">
              JPD Approved
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm text-gray-300 hover:text-[#C9A84C] transition-colors">Home</Link>
            <Link href="/products" className="text-sm text-gray-300 hover:text-[#C9A84C] transition-colors">Products</Link>
            <Link href="/contact" className="text-sm text-gray-300 hover:text-[#C9A84C] transition-colors">Contact</Link>
            <Link
              href="/booking"
              className="bg-[#C9A84C] text-black text-sm font-semibold px-5 py-2 rounded hover:bg-[#E8C96A] transition-colors"
            >
              Book Now
            </Link>
          </div>

          <button
            className="md:hidden text-gray-300 hover:text-white"
            onClick={() => setOpen(!open)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-[#141414] border-t border-[#2A2A2A] px-4 py-4 flex flex-col gap-4">
          <Link href="/" className="text-sm text-gray-300 hover:text-[#C9A84C]" onClick={() => setOpen(false)}>Home</Link>
          <Link href="/products" className="text-sm text-gray-300 hover:text-[#C9A84C]" onClick={() => setOpen(false)}>Products</Link>
          <Link href="/contact" className="text-sm text-gray-300 hover:text-[#C9A84C]" onClick={() => setOpen(false)}>Contact</Link>
          <Link
            href="/booking"
            className="bg-[#C9A84C] text-black text-sm font-semibold px-5 py-2 rounded text-center hover:bg-[#E8C96A]"
            onClick={() => setOpen(false)}
          >
            Book Now
          </Link>
        </div>
      )}
    </nav>
  );
}
