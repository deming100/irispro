"use client";

import { useState, useEffect, useCallback } from "react";
import { format } from "date-fns";

interface Booking {
  id: string;
  reference: string;
  status: string;
  serviceType: string;
  productTier: string;
  carPlate: string;
  carBrand: string;
  carModel: string;
  carType: string;
  appointmentDate: string;
  timeSlot: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  createdAt: string;
}

const statusColor: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  confirmed: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  completed: "bg-green-500/10 text-green-400 border-green-500/20",
  cancelled: "bg-red-500/10 text-red-400 border-red-500/20",
};

const nextStatus: Record<string, { label: string; value: string; color: string }[]> = {
  pending: [
    { label: "Confirm", value: "confirmed", color: "text-blue-400 hover:text-blue-300" },
    { label: "Cancel", value: "cancelled", color: "text-red-400 hover:text-red-300" },
  ],
  confirmed: [
    { label: "Complete", value: "completed", color: "text-green-400 hover:text-green-300" },
    { label: "Cancel", value: "cancelled", color: "text-red-400 hover:text-red-300" },
  ],
  completed: [],
  cancelled: [{ label: "Reinstate", value: "pending", color: "text-yellow-400 hover:text-yellow-300" }],
};

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterDate, setFilterDate] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filterDate) params.set("date", filterDate);
    if (filterStatus) params.set("status", filterStatus);
    const res = await fetch(`/api/bookings?${params}`);
    const data = await res.json();
    setBookings(data.bookings || []);
    setLoading(false);
  }, [filterDate, filterStatus]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetchBookings();
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Bookings</h1>
        <p className="text-gray-400 text-sm mt-1">Manage all customer bookings</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="bg-[#141414] border border-[#2A2A2A] rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-[#C9A84C]"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-[#141414] border border-[#2A2A2A] rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-[#C9A84C]"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        {(filterDate || filterStatus) && (
          <button
            onClick={() => { setFilterDate(""); setFilterStatus(""); }}
            className="text-sm text-gray-400 hover:text-white px-3 py-2 border border-[#2A2A2A] rounded-lg"
          >
            Clear filters
          </button>
        )}
        <div className="ml-auto text-sm text-gray-400 self-center">
          {bookings.length} booking{bookings.length !== 1 ? "s" : ""}
        </div>
      </div>

      <div className="bg-[#141414] border border-[#2A2A2A] rounded-xl overflow-hidden">
        {loading ? (
          <div className="text-center py-16 text-gray-500">Loading...</div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-16 text-gray-500">No bookings found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#2A2A2A]">
                  {["Reference", "Customer", "Vehicle", "Film", "Appointment", "Status", "Actions"].map((h) => (
                    <th key={h} className="text-left px-5 py-3 text-xs text-gray-500 font-medium whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id} className="border-b border-[#1A1A1A] hover:bg-[#1A1A1A] transition-colors">
                    <td className="px-5 py-4 text-xs text-[#C9A84C] font-mono whitespace-nowrap">{b.reference}</td>
                    <td className="px-5 py-4">
                      <div className="text-sm text-white">{b.customerName}</div>
                      <div className="text-xs text-gray-500">{b.customerPhone}</div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="text-sm text-white font-mono">{b.carPlate}</div>
                      <div className="text-xs text-gray-500">{b.carBrand} {b.carModel} · {b.carType}</div>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-300 whitespace-nowrap max-w-[140px] truncate">
                      {b.productTier}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="text-sm text-white">{format(new Date(new Date(b.appointmentDate).getTime() + 8 * 60 * 60 * 1000), "d MMM yyyy")}</div>
                      <div className="text-xs text-gray-500">{b.timeSlot}</div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded border capitalize ${statusColor[b.status]}`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-3">
                        {(nextStatus[b.status] || []).map((a) => (
                          <button
                            key={a.value}
                            onClick={() => updateStatus(b.id, a.value)}
                            className={`text-xs font-medium transition-colors ${a.color}`}
                          >
                            {a.label}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
