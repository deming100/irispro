import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#0A0A0A] border-t border-[#2A2A2A] py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="text-2xl font-bold mb-3">
              <span className="text-[#C9A84C]">Iris</span>
              <span className="text-white">Pro</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              JPD-approved premium car window tinting in Brunei. Protecting your vehicle with the finest films available.
            </p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-400 text-sm hover:text-[#C9A84C] transition-colors">Home</Link></li>
              <li><Link href="/products" className="text-gray-400 text-sm hover:text-[#C9A84C] transition-colors">Products</Link></li>
              <li><Link href="/booking" className="text-gray-400 text-sm hover:text-[#C9A84C] transition-colors">Book Now</Link></li>
              <li><Link href="/contact" className="text-gray-400 text-sm hover:text-[#C9A84C] transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-3">Contact</h3>
            <div className="space-y-2 text-sm text-gray-400">
              <p>Kg Bunut, BSB, Brunei</p>
              <p>+673 888-9918</p>
              <p>Mon – Sat: 9AM – 5PM</p>
            </div>
          </div>
        </div>
        <div className="border-t border-[#2A2A2A] mt-8 pt-6 text-center text-xs text-gray-600">
          © {new Date().getFullYear()} IrisPro Brunei. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
