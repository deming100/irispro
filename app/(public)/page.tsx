import Link from "next/link";
import { PRODUCTS } from "@/lib/constants";

const stats = [
  { value: "5,000+", label: "Cars Tinted" },
  { value: "10 Yr", label: "Max Warranty" },
  { value: "100%", label: "UV Block" },
  { value: "JPD", label: "Approved" },
];

const services = [
  {
    title: "Automobile Tinting",
    desc: "Premium nano-ceramic films for all car types. UV protection, heat rejection, and enhanced privacy.",
    icon: "🚗",
  },
  {
    title: "Residential Film",
    desc: "Keep your home cool and comfortable. Block UV rays, reduce glare, and protect your furniture.",
    icon: "🏠",
  },
  {
    title: "Commercial Film",
    desc: "Large-scale tinting for offices, shops, and commercial buildings. Safety, privacy and energy savings.",
    icon: "🏢",
  },
];

const whyUs = [
  { title: "JPD Approved", desc: "Fully compliant with Brunei's Road Transport Department regulations." },
  { title: "Nano-Ceramic Technology", desc: "Industry-leading films that outperform standard dyed or metallic tints." },
  { title: "Professional Installation", desc: "Trained technicians with years of experience for a flawless finish." },
  { title: "Warranty Backed", desc: "Up to 10-year manufacturer warranty on our premium DiamondX Series." },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0A] via-[#111111] to-[#0A0A0A]" />
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 30% 50%, #C9A84C 0%, transparent 50%), radial-gradient(circle at 70% 80%, #C9A84C 0%, transparent 40%)",
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-[#C9A84C]/10 border border-[#C9A84C]/30 text-[#C9A84C] text-xs font-medium px-3 py-1.5 rounded-full mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C] animate-pulse" />
              JPD-Approved Window Tinting in Brunei
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6">
              Premium Tint.
              <br />
              <span className="text-[#C9A84C]">Perfect Clarity.</span>
            </h1>
            <p className="text-gray-300 text-lg sm:text-xl mb-10 max-w-xl leading-relaxed">
              IrisPro delivers Brunei&apos;s finest window tinting experience. Nano-ceramic films, expert installation, and up to 10-year warranty.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/booking"
                className="bg-[#C9A84C] text-black font-bold px-8 py-4 rounded-lg hover:bg-[#E8C96A] transition-all duration-200 text-base"
              >
                Book Appointment
              </Link>
              <Link
                href="/products"
                className="border border-[#2A2A2A] text-white font-semibold px-8 py-4 rounded-lg hover:border-[#C9A84C] hover:text-[#C9A84C] transition-all duration-200 text-base"
              >
                View Products
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-[#141414] border-y border-[#2A2A2A] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl font-bold text-[#C9A84C] mb-1">{s.value}</div>
                <div className="text-gray-400 text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">Our Services</h2>
          <p className="text-gray-400">Professional tinting solutions for every need</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((s) => (
            <div
              key={s.title}
              className="bg-[#141414] border border-[#2A2A2A] rounded-xl p-8 hover:border-[#C9A84C]/50 transition-colors"
            >
              <div className="text-4xl mb-5">{s.icon}</div>
              <h3 className="text-xl font-semibold mb-3">{s.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Products teaser */}
      <section className="bg-[#141414] border-y border-[#2A2A2A] py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold mb-3">Our Film Series</h2>
            <p className="text-gray-400">Find the perfect protection for your vehicle</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {PRODUCTS.map((p) => (
              <div
                key={p.id}
                className={`relative bg-[#0A0A0A] rounded-xl p-6 border transition-colors ${
                  p.highlight
                    ? "border-[#C9A84C]"
                    : "border-[#2A2A2A] hover:border-[#C9A84C]/40"
                }`}
              >
                {p.highlight && (
                  <span className="absolute -top-3 left-6 bg-[#C9A84C] text-black text-xs font-bold px-3 py-0.5 rounded-full">
                    BEST SELLER
                  </span>
                )}
                <h3 className="text-white font-semibold text-lg mb-1">{p.name}</h3>
                <p className="text-[#C9A84C] text-xs mb-4">{p.tagline}</p>
                <div className="flex gap-4 text-sm text-gray-400">
                  <span>{p.uvBlock}% UV</span>
                  <span>{p.heatRejection}% Heat</span>
                  <span>{p.warranty}yr Warranty</span>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/products"
              className="border border-[#C9A84C] text-[#C9A84C] font-semibold px-8 py-3 rounded-lg hover:bg-[#C9A84C] hover:text-black transition-all duration-200"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">Why Choose IrisPro?</h2>
          <p className="text-gray-400">Brunei&apos;s most trusted tinting specialist</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {whyUs.map((w) => (
            <div
              key={w.title}
              className="flex gap-4 bg-[#141414] border border-[#2A2A2A] rounded-xl p-6"
            >
              <div className="w-8 h-8 rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                <div className="w-2 h-2 rounded-full bg-[#C9A84C]" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">{w.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{w.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-[#C9A84C] py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-black mb-4">
            Ready to Protect Your Vehicle?
          </h2>
          <p className="text-black/70 mb-8 text-lg">
            Book your appointment online in minutes. Available Mon–Sat.
          </p>
          <Link
            href="/booking"
            className="bg-black text-white font-bold px-10 py-4 rounded-lg hover:bg-[#111111] transition-colors text-base inline-block"
          >
            Book Now
          </Link>
        </div>
      </section>
    </div>
  );
}
