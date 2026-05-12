import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import Link from "next/link";

async function getStats() {
  const now = new Date();
  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);
  const endOfToday = new Date(now);
  endOfToday.setHours(23, 59, 59, 999);

  const [todayCount, totalCount, pendingCount, recentBookings] = await Promise.all([
    prisma.booking.count({
      where: { appointmentDate: { gte: startOfToday, lte: endOfToday } },
    }),
    prisma.booking.count(),
    prisma.booking.count({ where: { status: "pending" } }),
    prisma.booking.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return { todayCount, totalCount, pendingCount, recentBookings };
}

const statusColor: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  confirmed: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  completed: "bg-green-500/10 text-green-400 border-green-500/20",
  cancelled: "bg-red-500/10 text-red-400 border-red-500/20",
};

export default async function AdminDashboard() {
  const { todayCount, totalCount, pendingCount, recentBookings } = await getStats();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1">Overview of IrisPro bookings</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
        <div className="bg-[#141414] border border-[#2A2A2A] rounded-xl p-6">
          <p className="text-gray-400 text-sm mb-2">Today&apos;s Bookings</p>
          <p className="text-3xl font-bold text-[#C9A84C]">{todayCount}</p>
        </div>
        <div className="bg-[#141414] border border-[#2A2A2A] rounded-xl p-6">
          <p className="text-gray-400 text-sm mb-2">Total Bookings</p>
          <p className="text-3xl font-bold text-white">{totalCount}</p>
        </div>
        <div className="bg-[#141414] border border-[#2A2A2A] rounded-xl p-6">
          <p className="text-gray-400 text-sm mb-2">Pending Confirmation</p>
          <p className="text-3xl font-bold text-yellow-400">{pendingCount}</p>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-[#141414] border border-[#2A2A2A] rounded-xl">
        <div className="flex items-center justify-between p-6 border-b border-[#2A2A2A]">
          <h2 className="font-semibold">Recent Bookings</h2>
          <Link href="/admin/bookings" className="text-[#C9A84C] text-sm hover:underline">View all →</Link>
        </div>
        <div className="overflow-x-auto">
          {recentBookings.length === 0 ? (
            <div className="text-center py-12 text-gray-500">No bookings yet</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#2A2A2A]">
                  {["Reference", "Customer", "Vehicle", "Date", "Status"].map((h) => (
                    <th key={h} className="text-left px-6 py-3 text-xs text-gray-500 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((b) => (
                  <tr key={b.id} className="border-b border-[#1A1A1A] hover:bg-[#1A1A1A] transition-colors">
                    <td className="px-6 py-4 text-sm text-[#C9A84C] font-mono">{b.reference}</td>
                    <td className="px-6 py-4 text-sm">
                      <div className="text-white">{b.customerName}</div>
                      <div className="text-gray-500 text-xs">{b.customerPhone}</div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="text-white">{b.carPlate}</div>
                      <div className="text-gray-500 text-xs">{b.carBrand} {b.carModel}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      <div>{format(new Date(b.appointmentDate), "d MMM yyyy")}</div>
                      <div className="text-gray-500 text-xs">{b.timeSlot}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded border capitalize ${statusColor[b.status]}`}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
