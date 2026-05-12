import Link from "next/link";
import { PRODUCTS } from "@/lib/constants";

export default function ProductsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 bg-[#C9A84C]/10 border border-[#C9A84C]/30 text-[#C9A84C] text-xs font-medium px-3 py-1.5 rounded-full mb-4">
          Automobile Tint Films
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">Our Film Series</h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          All IrisPro films carry 100% UV protection and are JPD-approved for use in Brunei.
          Choose the series that fits your needs and budget.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {PRODUCTS.map((p) => (
          <div
            key={p.id}
            className={`relative bg-[#141414] rounded-2xl border overflow-hidden flex flex-col transition-all hover:-translate-y-1 ${
              p.highlight ? "border-[#C9A84C]" : "border-[#2A2A2A]"
            }`}
          >
            {p.highlight && (
              <div className="bg-[#C9A84C] text-black text-xs font-bold text-center py-2">
                ★ BEST SELLER — MOST POPULAR
              </div>
            )}

            <div className="p-8 flex flex-col flex-1">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-1">{p.name}</h2>
                <p className="text-[#C9A84C] text-sm font-medium">{p.tagline}</p>
              </div>

              <p className="text-gray-400 text-sm leading-relaxed mb-8">{p.description}</p>

              <div className="grid grid-cols-3 gap-3 mb-8">
                <div className="bg-[#0A0A0A] rounded-lg p-3 text-center">
                  <div className="text-[#C9A84C] font-bold text-lg">{p.uvBlock}%</div>
                  <div className="text-gray-500 text-xs mt-0.5">UV Block</div>
                </div>
                <div className="bg-[#0A0A0A] rounded-lg p-3 text-center">
                  <div className="text-[#C9A84C] font-bold text-lg">{p.heatRejection}%</div>
                  <div className="text-gray-500 text-xs mt-0.5">Heat Rej.</div>
                </div>
                <div className="bg-[#0A0A0A] rounded-lg p-3 text-center">
                  <div className="text-[#C9A84C] font-bold text-lg">{p.warranty}yr</div>
                  <div className="text-gray-500 text-xs mt-0.5">Warranty</div>
                </div>
              </div>

              <ul className="space-y-2 mb-8 text-sm text-gray-400">
                <li className="flex items-center gap-2">
                  <span className="text-[#C9A84C]">✓</span> 100% UV Protection
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#C9A84C]">✓</span> {p.heatRejection}% Solar Heat Rejection
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#C9A84C]">✓</span> {p.warranty}-Year Manufacturer Warranty
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#C9A84C]">✓</span> JPD Compliant
                </li>
                {p.highlight && (
                  <li className="flex items-center gap-2">
                    <span className="text-[#C9A84C]">✓</span> Nano-Ceramic Technology
                  </li>
                )}
              </ul>

              <div className="mt-auto">
                <Link
                  href={`/booking?product=${p.id}`}
                  className={`block w-full text-center font-semibold py-3 rounded-lg transition-all ${
                    p.highlight
                      ? "bg-[#C9A84C] text-black hover:bg-[#E8C96A]"
                      : "border border-[#C9A84C] text-[#C9A84C] hover:bg-[#C9A84C] hover:text-black"
                  }`}
                >
                  Book Now
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 bg-[#141414] border border-[#2A2A2A] rounded-2xl p-8 text-center">
        <h3 className="text-2xl font-bold mb-3">Not Sure Which to Choose?</h3>
        <p className="text-gray-400 mb-6">
          Contact us on WhatsApp and our team will recommend the best film for your vehicle and budget.
        </p>
        <a
          href="https://wa.me/6738889918?text=Hi%20IrisPro!%20I%27d%20like%20help%20choosing%20a%20tint%20film."
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-[#25D366] text-white font-semibold px-6 py-3 rounded-lg hover:bg-[#20bd5a] transition-colors"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          Chat on WhatsApp
        </a>
      </div>
    </div>
  );
}
