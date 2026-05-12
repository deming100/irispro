"use client";
import Link from "next/link";
import { useState } from "react";

export default function DemoBanner() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-[#C9A84C] text-black px-3 py-1.5 flex items-center justify-between gap-2 text-sm font-medium">
      <div className="flex items-center gap-2 min-w-0">
        <span className="font-bold whitespace-nowrap">🎯 Demo</span>
        <Link
          href="/admin/login"
          className="bg-black text-[#C9A84C] px-2.5 py-0.5 rounded font-bold text-xs hover:bg-[#111] transition-colors whitespace-nowrap"
        >
          Admin Login
        </Link>
        <span className="text-black/70 text-xs hidden sm:inline whitespace-nowrap">
          admin@irispro.bn &nbsp;|&nbsp; admin123
        </span>
      </div>
      <button
        onClick={() => setVisible(false)}
        className="text-black/60 hover:text-black text-base leading-none flex-shrink-0 ml-1"
        aria-label="Close"
      >
        ✕
      </button>
    </div>
  );
}
