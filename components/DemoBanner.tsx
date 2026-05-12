"use client";
import Link from "next/link";
import { useState } from "react";

export default function DemoBanner() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-[#C9A84C] text-black px-4 py-2 flex items-center justify-between gap-4 text-sm font-medium">
      <div className="flex items-center gap-3 flex-wrap">
        <span>🎯 <strong>Demo Mode</strong> — View the admin panel:</span>
        <Link
          href="/admin/login"
          className="bg-black text-[#C9A84C] px-3 py-1 rounded font-bold text-xs hover:bg-[#111] transition-colors"
        >
          Admin Login
        </Link>
        <span className="text-black/70 text-xs">
          Email: <strong>admin@irispro.bn</strong> &nbsp;|&nbsp; Password: <strong>admin123</strong>
        </span>
      </div>
      <button
        onClick={() => setVisible(false)}
        className="text-black/60 hover:text-black text-lg leading-none flex-shrink-0"
        aria-label="Close"
      >
        ✕
      </button>
    </div>
  );
}
