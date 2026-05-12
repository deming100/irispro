"use client";

import { useState, useEffect } from "react";
import { TIME_SLOTS } from "@/lib/constants";

interface SlotConfig {
  id: string;
  timeSlot: string;
  maxCapacity: number;
  date: string | null;
}

export default function AdminSlotsPage() {
  const [, setConfigs] = useState<SlotConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [localCapacities, setLocalCapacities] = useState<Record<string, number>>({});

  const fetchConfigs = async (date?: string) => {
    setLoading(true);
    const res = await fetch(`/api/admin/slots${date ? `?date=${date}` : ""}`);
    const data = await res.json();
    setConfigs(data.configs || []);

    const caps: Record<string, number> = {};
    for (const slot of TIME_SLOTS) {
      const found = (data.configs || []).find(
        (c: SlotConfig) => c.timeSlot === slot && (date ? c.date === date : c.date === null)
      );
      caps[slot] = found?.maxCapacity ?? 3;
    }
    setLocalCapacities(caps);
    setLoading(false);
  };

  useEffect(() => {
    fetchConfigs(selectedDate || undefined);
  }, [selectedDate]);

  const handleSave = async (slot: string) => {
    setSaving(slot);
    await fetch("/api/admin/slots", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        timeSlot: slot,
        maxCapacity: localCapacities[slot],
        date: selectedDate || null,
      }),
    });
    setSaving(null);
    fetchConfigs(selectedDate || undefined);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Slot Configuration</h1>
        <p className="text-gray-400 text-sm mt-1">
          Set maximum bookings per time slot. Date-specific configs override the default.
        </p>
      </div>

      <div className="flex flex-wrap gap-4 mb-8 items-end">
        <div>
          <label className="block text-sm text-gray-400 mb-1.5">
            Override for specific date (optional)
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-[#141414] border border-[#2A2A2A] rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-[#C9A84C]"
          />
        </div>
        {selectedDate && (
          <button
            onClick={() => setSelectedDate("")}
            className="text-sm text-gray-400 hover:text-white px-4 py-2 border border-[#2A2A2A] rounded-lg"
          >
            Back to defaults
          </button>
        )}
      </div>

      <div className="bg-[#141414] border border-[#2A2A2A] rounded-xl p-1">
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading...</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2A2A2A]">
                <th className="text-left px-6 py-3 text-xs text-gray-500 font-medium">Time Slot</th>
                <th className="text-left px-6 py-3 text-xs text-gray-500 font-medium">Max Capacity</th>
                <th className="text-left px-6 py-3 text-xs text-gray-500 font-medium">Scope</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody>
              {TIME_SLOTS.map((slot) => (
                <tr key={slot} className="border-b border-[#1A1A1A] last:border-0">
                  <td className="px-6 py-4 text-sm font-medium text-white">{slot}</td>
                  <td className="px-6 py-4">
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={localCapacities[slot] ?? 3}
                      onChange={(e) =>
                        setLocalCapacities((c) => ({ ...c, [slot]: parseInt(e.target.value) || 1 }))
                      }
                      className="w-20 bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#C9A84C] text-center"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-1 rounded border ${
                      selectedDate
                        ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                        : "bg-[#2A2A2A] text-gray-400 border-[#3A3A3A]"
                    }`}>
                      {selectedDate ? selectedDate : "Default (all dates)"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleSave(slot)}
                      disabled={saving === slot}
                      className="bg-[#C9A84C] text-black text-xs font-bold px-4 py-2 rounded-lg hover:bg-[#E8C96A] disabled:opacity-50 transition-colors"
                    >
                      {saving === slot ? "Saving..." : "Save"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="mt-6 p-4 bg-[#141414] border border-[#2A2A2A] rounded-xl text-sm text-gray-400">
        <strong className="text-white">Note:</strong> If a date-specific config exists for a slot, it overrides the default.
        If no date-specific config exists, the default capacity is used. Changes apply immediately to new bookings.
      </div>
    </div>
  );
}
