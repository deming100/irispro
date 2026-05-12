export const dynamic = "force-dynamic";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import SignOutButton from "./SignOutButton";

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div>
      <div className="bg-[#141414] border-b border-[#2A2A2A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-6">
              <Link href="/admin" className="text-lg font-bold">
                <span className="text-[#C9A84C]">Iris</span>
                <span className="text-white">Pro</span>
                <span className="text-gray-500 text-sm font-normal ml-2">Admin</span>
              </Link>
              <nav className="hidden md:flex items-center gap-4">
                <Link href="/admin" className="text-sm text-gray-400 hover:text-white transition-colors">Dashboard</Link>
                <Link href="/admin/bookings" className="text-sm text-gray-400 hover:text-white transition-colors">Bookings</Link>
                <Link href="/admin/slots" className="text-sm text-gray-400 hover:text-white transition-colors">Slot Config</Link>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/" className="text-xs text-gray-500 hover:text-gray-300 transition-colors hidden sm:inline">← View Site</Link>
              <SignOutButton />
            </div>
          </div>
        </div>
        {/* Mobile nav */}
        <div className="md:hidden border-t border-[#2A2A2A] overflow-x-auto">
          <div className="flex px-4 gap-1">
            <Link href="/admin" className="text-xs text-gray-400 hover:text-white py-2.5 px-3 whitespace-nowrap border-b-2 border-transparent hover:border-[#C9A84C] transition-colors">Dashboard</Link>
            <Link href="/admin/bookings" className="text-xs text-gray-400 hover:text-white py-2.5 px-3 whitespace-nowrap border-b-2 border-transparent hover:border-[#C9A84C] transition-colors">Bookings</Link>
            <Link href="/admin/slots" className="text-xs text-gray-400 hover:text-white py-2.5 px-3 whitespace-nowrap border-b-2 border-transparent hover:border-[#C9A84C] transition-colors">Slot Config</Link>
            <Link href="/" className="text-xs text-gray-500 hover:text-gray-300 py-2.5 px-3 whitespace-nowrap ml-auto">← Site</Link>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">{children}</div>
    </div>
  );
}
