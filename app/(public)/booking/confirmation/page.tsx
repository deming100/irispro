"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const ref = searchParams.get("ref");

  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center">
      <div className="bg-[#141414] border border-[#2A2A2A] rounded-2xl p-10">
        <div className="w-20 h-20 rounded-full bg-[#C9A84C]/10 border-2 border-[#C9A84C] flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-[#C9A84C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-3xl font-bold mb-3">Booking Received!</h1>
        <p className="text-gray-400 mb-8">
          Thank you for choosing IrisPro. We&apos;ve received your booking and will confirm it via WhatsApp shortly.
        </p>

        {ref && (
          <div className="bg-[#0A0A0A] border border-[#C9A84C]/30 rounded-xl p-6 mb-8">
            <p className="text-gray-400 text-sm mb-2">Your Booking Reference</p>
            <p className="text-[#C9A84C] text-2xl font-bold tracking-wider">{ref}</p>
            <p className="text-gray-500 text-xs mt-2">Save this reference number for your records</p>
          </div>
        )}

        <div className="bg-[#0A0A0A] rounded-xl p-5 mb-8 text-left space-y-2">
          <h3 className="text-sm font-semibold text-gray-300 mb-3">What happens next?</h3>
          <div className="flex items-start gap-3 text-sm text-gray-400">
            <span className="text-[#C9A84C] font-bold">1.</span>
            <span>We&apos;ll review your booking and confirm via WhatsApp within 1 hour during business hours.</span>
          </div>
          <div className="flex items-start gap-3 text-sm text-gray-400">
            <span className="text-[#C9A84C] font-bold">2.</span>
            <span>Please arrive 10 minutes before your scheduled time slot.</span>
          </div>
          <div className="flex items-start gap-3 text-sm text-gray-400">
            <span className="text-[#C9A84C] font-bold">3.</span>
            <span>The tinting process typically takes 2–4 hours depending on the vehicle and film type.</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href="https://wa.me/6738889918?text=Hi%20IrisPro!%20I%27ve%20just%20made%20a%20booking%20and%20my%20reference%20is%20"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] text-white font-semibold py-3 rounded-lg hover:bg-[#20bd5a] transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Contact Us
          </a>
          <Link
            href="/"
            className="flex-1 border border-[#2A2A2A] text-gray-300 font-semibold py-3 rounded-lg hover:border-[#C9A84C] hover:text-[#C9A84C] transition-colors text-center"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-gray-400">Loading...</div>}>
      <ConfirmationContent />
    </Suspense>
  );
}
